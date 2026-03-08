import z from "zod";

const bodySchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const loginSchema = z.object({
  body: bodySchema,
});

export type LoginDataType = z.infer<typeof bodySchema>;
