import z from "zod";

const bodySchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

export const signupSchema = z.object({
  body: bodySchema,
});

export type SignUpDataType = z.infer<typeof bodySchema>;
