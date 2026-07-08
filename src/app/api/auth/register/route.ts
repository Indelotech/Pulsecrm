import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const payload = registerSchema.parse(await request.json());

    const existingUser = await prisma.user.findUnique({
      where: { email: payload.email }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "An account with that email already exists." },
        { status: 409 }
      );
    }

    const password = await hash(payload.password, 12);

    await prisma.company.create({
      data: {
        name: payload.companyName,
        users: {
          create: {
            name: payload.name,
            email: payload.email,
            password
          }
        },
        activities: {
          create: {
            type: "CUSTOMER",
            title: "Workspace created",
            detail: `${payload.name} opened a new CRM workspace.`
          }
        }
      }
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: error.issues[0]?.message ?? "Invalid registration data." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Unable to create your workspace right now." },
      { status: 500 }
    );
  }
}
