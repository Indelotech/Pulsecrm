"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { parseForm, settingsSchema } from "@/lib/validations";

export async function updateSettings(formData: FormData) {
  const user = await requireUser();
  const data = parseForm(settingsSchema, formData);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { name: data.name }
    }),
    prisma.company.update({
      where: { id: user.companyId },
      data: { name: data.companyName }
    })
  ]);

  await prisma.activity.create({
    data: {
      companyId: user.companyId,
      type: "CUSTOMER",
      title: "Workspace settings updated",
      detail: data.companyName
    }
  });

  revalidatePath("/settings");
  revalidatePath("/dashboard");
}
