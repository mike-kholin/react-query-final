import prisma from "@/prisma/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export interface PatientShema {
  id: string;
  name: string;
  disease: string;
}

const PatientShema = z.object({
  name: z.string(),
  disease: z.string(),
});

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const body = Object.fromEntries(formData);
  const validation = PatientShema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { errror: "something went wrong" },
      { status: 404 }
    );
  }

  const { disease, name } = validation.data;

  const results = await prisma.patient.create({
    data: {
      name,
      disease,
    },
  });

  return NextResponse.json(results, { status: 201 });
}

export async function GET(request: NextRequest) {
  const data = await prisma.patient.findMany();

  return NextResponse.json(data, { status: 200 });
}
