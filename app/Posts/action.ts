"use server";

import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

interface prevStateType {
  error?: {
    title?: string[];
    description?: string[];
  };
  message?: string | null;
}

const PostSchema = z.object({
  title: z.string(),
  description: z.string(),
});

type PostType = z.infer<typeof PostSchema>;

type post = Partial<PostType>;

export async function newPost(
  formData: FormData,
  prevState: prevStateType | undefined
) {
  try {
    const validation = PostSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
    });

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      const State: prevStateType = {
        error: {
          title: errors.title,
          description: errors.description,
        },
        message: "something went wrong",
      };
      return State;
    } else {
      // possibly put the post here
      const { title, description } = validation.data;
      try {
        const newPost = await prisma.post.create({
          data: {
            title,
            description,
          },
        });
        return NextResponse.json(newPost, { status: 201 });
      } catch (error) {
        console.log(error);
      }
      //end of api
    }
  } catch (error) {
    console.log(error);
  }
}

// export async function POST(request: NextRequest) {
//   const body = await request.json();
//   const validation = PostSchema.safeParse(body);

//   if (!validation.success)
//     return NextResponse.json(
//       { error: "somerhing went wrong" },
//       { status: 400 }
//     );
// }
