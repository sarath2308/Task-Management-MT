import { ITask } from "@/model/task.model";
import { IBaseRepo } from "./base.repo.interface";

export interface ITaskRepo extends IBaseRepo<ITask> {
  removeTask: (taskId: string) => Promise<void>;
  getTasksByUser: (userId: string) => Promise<{completed:ITask[], pending: ITask[]}>;
  taskTitleAvailability: (userId: string, title: string) => Promise<boolean>;
  taskTitleAvailabilityOnUpdate: (
    taskId: string,
    userId: string,
    title: string,
  ) => Promise<boolean>;
 getStatistic:(userId: string) => Promise<{total: number, completed: number, pending: number}>
}
