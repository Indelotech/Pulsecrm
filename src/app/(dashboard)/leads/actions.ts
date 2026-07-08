"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { leadSchema, noteSchema, parseForm } from "@/lib/validations";

function parseDate(value?: string) {
  return value ? new Date(value) : null;
}

export async function createLead(formData: FormData) {
  const user = await requireUser();
  const data = parseForm(leadSchema, formData);

  const lead = await prisma.lead.create({
    data: {
      ...data,
      expectedClose: parseDate(data.expectedClose),
      companyId: user.companyId
    }
  });

  await prisma.activity.create({
    data: {
      companyId: user.companyId,
      type: "LEAD",
      title: "Lead added",
      detail: `${data.name} · ${data.status.toLowerCase()}`
    }
  });

  revalidatePath("/leads");
  redirect(`/leads/${lead.id}`);
}

export async function updateLead(id: string, formData: FormData) {
  const user = await requireUser();
  const data = parseForm(leadSchema, formData);

  await prisma.lead.update({
    where: {
      id,
      companyId: user.companyId
    },
    data: {
      ...data,
      expectedClose: parseDate(data.expectedClose)
    }
  });

  await prisma.activity.create({
    data: {
      companyId: user.companyId,
      type: data.status === "WON" ? "DEAL" : "LEAD",
      title: data.status === "WON" ? "Deal won" : "Lead updated",
      detail: data.name
    }
  });

  revalidatePath("/leads");
  revalidatePath(`/leads/${id}`);
  redirect(`/leads/${id}`);
}

export async function deleteLead(id: string) {
  const user = await requireUser();

  const lead = await prisma.lead.delete({
    where: {
      id,
      companyId: user.companyId
    },
    select: { name: true }
  });

  await prisma.activity.create({
    data: {
      companyId: user.companyId,
      type: "LEAD",
      title: "Lead deleted",
      detail: lead.name
    }
  });

  revalidatePath("/leads");
  redirect("/leads");
}

export async function addLeadNote(leadId: string, formData: FormData) {
  const user = await requireUser();
  const data = parseForm(noteSchema, formData);

  const lead = await prisma.lead.findFirstOrThrow({
    where: { id: leadId, companyId: user.companyId },
    select: { name: true }
  });

  await prisma.note.create({
    data: {
      companyId: user.companyId,
      leadId,
      body: data.body
    }
  });

  await prisma.activity.create({
    data: {
      companyId: user.companyId,
      type: "NOTE",
      title: "Lead note added",
      detail: lead.name
    }
  });

  revalidatePath(`/leads/${leadId}`);
}
