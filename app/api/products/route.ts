import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const newProduct = await prisma.product.findMany();
  return NextResponse.json(newProduct);
}
