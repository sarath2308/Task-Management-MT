import z from "zod";

export const TaskResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.string(),
});

export type TaskResponseType = z.infer<typeof TaskResponseSchema>;
