import prisma from "@/prisma/db";
import { productSchema } from "@/validators/product";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = request.json();

  const validator = productSchema.safeParse(body);

  if (!validator.success)
    return NextResponse.json({ error: "not succesfull" }, { status: 401 });

  const { title, description } = validator.data;

  const newProduct = await prisma.product.create({
    data: {
      title,
      description,
    },
  });
  return { newProduct };
}
