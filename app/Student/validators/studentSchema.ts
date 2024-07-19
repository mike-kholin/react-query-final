import { z } from "zod";

export const StudentSchema = z.object({
  name: z.string().min(1, { message: "name is too short" }),
  subject: z.string().min(1, { message: "subject is too short" }),
});

export type SchemaType = z.infer<typeof StudentSchema>;
