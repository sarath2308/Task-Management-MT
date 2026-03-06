import { ITask } from "@/model/task.model";
import { IBaseRepo } from "./base.repo.interface";

export interface ITaskRepo extends IBaseRepo<ITask> {}
