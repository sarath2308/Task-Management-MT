import z from "zod";

const bodySchema = z.object({
  title: z.string(),
  description: z.string(),
});

export const CreateTaskSchema = z.object({
  body: bodySchema,
});

export type CreateTaskDataType = z.infer<typeof bodySchema>;
