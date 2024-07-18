import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(1, { message: "title too short" }),
  description: z.string(),
});

export type productSchemaType = z.infer<typeof productSchema>;
