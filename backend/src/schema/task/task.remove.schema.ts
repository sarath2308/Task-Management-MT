import z from "zod";

const params = z.object({
  taskId: z.string().regex(/^[0-9a-fA-F]{24}$/, {
    message: "Invalid task id",
  }),
});
export const RemoveTaskSchema = z.object({
  params: params,
});
