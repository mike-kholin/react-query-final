import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const MealSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = MealSchema.safeParse(body);

  if (!validation.success)
    return NextResponse.json(
      { error: validation.error.flatten().fieldErrors },
      { status: 404 }
    );

  const { name, description } = validation.data;

  try {
    const response = await prisma.meals.create({
      data: {
        name,
        description,
      },
    });
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.log(error);
  }
}

export async function GET(request: NextRequest) {
  const response = await prisma.meals.findMany();
  return NextResponse.json(response, { status: 200 });
}
