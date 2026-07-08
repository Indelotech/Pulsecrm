"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { parseForm, taskSchema } from "@/lib/validations";

function parseDate(value?: string) {
  return value ? new Date(value) : null;
}

function parseRelation(value?: string) {
  if (!value || value === "none") return {};
  const [type, id] = value.split(":");

  if (type === "customer" && id) return { customerId: id };
  if (type === "lead" && id) return { leadId: id };

  return {};
}

export async function createTask(formData: FormData) {
  const user = await requireUser();
  const data = parseForm(taskSchema, formData);

  await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      dueDate: parseDate(data.dueDate),
      status: data.status,
      priority: data.priority,
      companyId: user.companyId,
      assigneeId: user.id,
      ...parseRelation(data.relation)
    }
  });

  await prisma.activity.create({
    data: {
      companyId: user.companyId,
      type: "TASK",
      title: "Task created",
      detail: data.title
    }
  });

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
}

export async function updateTask(id: string, formData: FormData) {
  const user = await requireUser();
  const data = parseForm(taskSchema, formData);
  const relation = parseRelation(data.relation);

  await prisma.task.update({
    where: {
      id,
      companyId: user.companyId
    },
    data: {
      title: data.title,
      description: data.description,
      dueDate: parseDate(data.dueDate),
      status: data.status,
      priority: data.priority,
      customerId: "customerId" in relation ? relation.customerId : null,
      leadId: "leadId" in relation ? relation.leadId : null
    }
  });

  await prisma.activity.create({
    data: {
      companyId: user.companyId,
      type: "TASK",
      title: "Task updated",
      detail: data.title
    }
  });

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
}

export async function deleteTask(id: string) {
  const user = await requireUser();
  const task = await prisma.task.delete({
    where: {
      id,
      companyId: user.companyId
    },
    select: { title: true }
  });

  await prisma.activity.create({
    data: {
      companyId: user.companyId,
      type: "TASK",
      title: "Task deleted",
      detail: task.title
    }
  });

  revalidatePath("/tasks");
  revalidatePath("/dashboard");
}
