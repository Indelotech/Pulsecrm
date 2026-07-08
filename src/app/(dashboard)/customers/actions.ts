"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { customerSchema, noteSchema, parseForm } from "@/lib/validations";

export async function createCustomer(formData: FormData) {
  const user = await requireUser();
  const data = parseForm(customerSchema, formData);

  const customer = await prisma.customer.create({
    data: {
      ...data,
      companyId: user.companyId
    }
  });

  await prisma.activity.create({
    data: {
      companyId: user.companyId,
      type: "CUSTOMER",
      title: "Customer added",
      detail: data.name
    }
  });

  revalidatePath("/customers");
  redirect(`/customers/${customer.id}`);
}

export async function updateCustomer(id: string, formData: FormData) {
  const user = await requireUser();
  const data = parseForm(customerSchema, formData);

  await prisma.customer.update({
    where: {
      id,
      companyId: user.companyId
    },
    data
  });

  await prisma.activity.create({
    data: {
      companyId: user.companyId,
      type: "CUSTOMER",
      title: "Customer updated",
      detail: data.name
    }
  });

  revalidatePath("/customers");
  revalidatePath(`/customers/${id}`);
  redirect(`/customers/${id}`);
}

export async function deleteCustomer(id: string) {
  const user = await requireUser();

  const customer = await prisma.customer.delete({
    where: {
      id,
      companyId: user.companyId
    },
    select: { name: true }
  });

  await prisma.activity.create({
    data: {
      companyId: user.companyId,
      type: "CUSTOMER",
      title: "Customer deleted",
      detail: customer.name
    }
  });

  revalidatePath("/customers");
  redirect("/customers");
}

export async function addCustomerNote(customerId: string, formData: FormData) {
  const user = await requireUser();
  const data = parseForm(noteSchema, formData);

  const customer = await prisma.customer.findFirstOrThrow({
    where: { id: customerId, companyId: user.companyId },
    select: { name: true }
  });

  await prisma.note.create({
    data: {
      companyId: user.companyId,
      customerId,
      body: data.body
    }
  });

  await prisma.activity.create({
    data: {
      companyId: user.companyId,
      type: "NOTE",
      title: "Customer note added",
      detail: customer.name
    }
  });

  revalidatePath(`/customers/${customerId}`);
}
