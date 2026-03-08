import { CreateTaskDataType } from "@/schema/task/task.create.schema";
import { TaskResponseType } from "@/schema/task/task.response.schema";
import { UpdateTaskDataType } from "@/schema/task/task.update.schema";

export interface ITaskService {
  createTask: (userId: string, data: CreateTaskDataType) => Promise<void>;
  updateTask: (taskId: string, data: UpdateTaskDataType) => Promise<void>;
  removeTask: (taskId: string) => Promise<void>;
  getAllTaskOfUser: (
    userId: string,
  ) => Promise<{
    completedTasks: TaskResponseType[];
    pendingTask: TaskResponseType[];
  }>;
  getTaskStatistics: (
    userId: string,
  ) => Promise<{ total: number; completed: number; pending: number }>;
  toggleStatus:(taskId: string) => Promise<void>
}
