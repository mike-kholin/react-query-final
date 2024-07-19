import { z } from "zod";

export const tweetSchema = z.object({
  name: z.string().min(1, { message: "Field is required" }),
  handle: z.string().min(1, { message: "Field is required" }),
  message: z.string().optional(),
});

export type tweetSchemaType = z.infer<typeof tweetSchema>;
