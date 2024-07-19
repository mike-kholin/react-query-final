import { StudentSchema } from "@/app/Student/validators/studentSchema";
import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const body = Object.fromEntries(formData);
  const validation = StudentSchema.safeParse(body);

  if (!validation.success)
    return NextResponse.json(
      { error: validation.error.flatten().fieldErrors },
      { status: 400 }
    );

  const { name, subject } = validation.data;

  try {
    const response = await prisma.student.create({
      data: {
        name,
        subject,
      },
    });

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "failed to register" });
  }
}

export async function GET(request: NextRequest) {
  const response = await prisma.student.findMany();
  return NextResponse.json(response);
}
