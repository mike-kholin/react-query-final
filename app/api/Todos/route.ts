import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const TodoSchema = z.object({
  task: z.string(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = TodoSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(
      { error: validation.error.flatten().fieldErrors },
      { status: 404 }
    );

  const { task } = validation.data;

  try {
    const response = await prisma.todos.create({
      data: {
        task,
      },
    });
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.log(error);
  }
}

export async function GET(request: NextRequest) {
  const response = await prisma.todos.findMany();
  return NextResponse.json(response, { status: 200 });
}
