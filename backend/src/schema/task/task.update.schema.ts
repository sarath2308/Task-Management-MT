import z from "zod";

const bodySchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

const params = z.object({
  taskId: z.string().regex(/^[0-9a-fA-F]{24}$/, {
    message: "Invalid task id",
  }),
});
export const UpdateTaskSchema = z.object({
  body: bodySchema,
  params: params,
});

export type UpdateTaskDataType = z.infer<typeof bodySchema>;
