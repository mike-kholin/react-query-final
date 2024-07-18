"use server";

import prisma from "@/prisma/db";
import axios from "axios";
import { z } from "zod";

interface state {
  errors?: {
    title?: string[];
    description?: string[];
  };
  message?: string | null;
}
const postSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export async function CreatePost(
  prevState: state | undefined,
  formData: FormData
) {
  const validation = postSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
  });

  if (!validation.success) {
    return {
      errors: validation.error.flatten().fieldErrors,
      message: "failed",
    };
  }
  const { title, description } = validation.data;

  try {
    const newData = await prisma.post.create({
      data: {
        title,
        description,
      },
    });
    return { message: "success", newData };
  } catch (error) {
    return {
      message: "failed",
      errors: {
        title: ["Failed to create post"],
        description: ["Failed to create post"],
      },
    };
  }

  return { message: "success" };
}
