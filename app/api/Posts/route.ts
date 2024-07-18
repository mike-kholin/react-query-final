import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const postSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = postSchema.safeParse(body);

  if (!validation.success)
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 404 }
    );

  const { title, description } = validation.data;

  const newData = await prisma.post.create({
    data: {
      title,
      description,
    },
  });
  return NextResponse.json(newData);
}
