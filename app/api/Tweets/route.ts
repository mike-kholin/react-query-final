import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const tweets = await prisma.tweet.findMany();
  return NextResponse.json(tweets);
}
