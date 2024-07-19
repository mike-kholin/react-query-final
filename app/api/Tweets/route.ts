import { tweetSchema } from "@/app/Tweets/validators/tweetSchema";
import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const tweets = await prisma.tweet.findMany();
  return NextResponse.json(tweets);
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const body = Object.fromEntries(formData);

  const validation = tweetSchema.safeParse(body);

  if (!validation.success)
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 401 }
    );

  const { message, handle, name } = validation.data;

  const newData = await prisma.tweet.create({
    data: {
      name,
      handle,
      message,
    },
  });

  return NextResponse.json(newData, { status: 201 });
}
