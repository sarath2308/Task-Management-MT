import { inject, injectable } from "inversify";
import { BaseRepo } from "./base/base";
import { ITask } from "@/model/task.model";
import { ITaskRepo } from "@/interface/task.repo.interface";
import { TYPES } from "@/types/inversify/inversify.types";
import { Model } from "mongoose";

@injectable()
export class TaskRepo extends BaseRepo<ITask> implements ITaskRepo {
  constructor(@inject(TYPES.ITask) private _taskModel: Model<ITask>) {
    super(_taskModel);
  }
}
