"use server";
import prisma from "@/prisma/db";
import { z } from "zod";

interface prevState {
  errors?: {
    name?: string[];
    handle?: string[];
    message?: string[];
  };
  message?: string | null;
}

const tweetSchema = z.object({
  name: z.string().min(1, { message: "Field is required" }),
  handle: z.string().min(1, { message: "Field is required" }),
  message: z.string().optional(),
});

export async function Tweet(
  prevState: prevState | undefined,
  formData: FormData
) {
  const validation = tweetSchema.safeParse({
    name: formData.get("name"),
    handle: formData.get("handle"),
    message: formData.get("message"),
  });

  if (!validation.success) {
    return {
      errors: validation.error.flatten().fieldErrors,
      message: "something went wrong",
    };
  }

  const { name, handle, message } = validation.data;

  try {
    const newTweet = await prisma.tweet.create({
      data: {
        name,
        handle,
        message,
      },
    });
    return { newTweet, message: "success" };
  } catch (error) {
    return {
      message: "creation failed",
      errors: {
        name: ["error creating name"],
        handle: ["error creating handle"],
        message: ["error creating message "],
      },
    };
  }
}
