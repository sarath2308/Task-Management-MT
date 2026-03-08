import { ITask } from "@/model/task.model";
import { TaskResponseSchema } from "@/schema/task/task.response.schema";

export function TaskResponseMapper(task: ITask) {
  const t = {
    id: String(task._id),
    title: task.title,
    description: task.description,
    status: task.status,
  };

  return TaskResponseSchema.parse(t);
}
