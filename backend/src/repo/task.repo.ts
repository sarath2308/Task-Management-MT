import { inject, injectable } from "inversify";
import { BaseRepo } from "./base/base";
import { ITask } from "@/model/task.model";
import { ITaskRepo } from "@/interface/task.repo.interface";
import { TYPES } from "@/types/inversify/inversify.types";
import mongoose, { Model } from "mongoose";
import { TASK_STATUS } from "@/types/task/task.status.type";

@injectable()
export class TaskRepo extends BaseRepo<ITask> implements ITaskRepo {
  constructor(@inject(TYPES.ITask) private _taskModel: Model<ITask>) {
    super(_taskModel);
  }

  async getTasksByUser(userId: string): Promise<{completed: ITask[] | [], pending: ITask[] | []}> {
    const completed =  await this._taskModel.find({
      user: new mongoose.Types.ObjectId(userId),
      status:TASK_STATUS.COMPLETED,
      isDeleted: false,
    });

    const pending = await this._taskModel.find({
      user: new mongoose.Types.ObjectId(userId),
      status:TASK_STATUS.PENDING,
      isDeleted: false,
    });

    return {completed,pending}
  }
  async removeTask(taskId: string): Promise<void> {
    await this._taskModel.updateOne(
      { _id: taskId },
      { $set: { isDeleted: true } },
    );
  }
  async taskTitleAvailability(userId: string, title: string): Promise<boolean> {
    const exists = await this._taskModel.exists({
      user: new mongoose.Types.ObjectId(userId),
      title: title,
      isDeleted: false,
    });

    return !!exists;
  }
  async taskTitleAvailabilityOnUpdate(
    taskId: string,
    userId: string,
    title: string,
  ): Promise<boolean> {
    const exists = await this._taskModel.exists({
      user: new mongoose.Types.ObjectId(userId),
      title,
      _id: { $ne: new mongoose.Types.ObjectId(taskId) },
      isDeleted: false,
    });

    return !!exists;
  }
  async getStatistic(userId: string): Promise<{ total: number; completed: number; pending: number; }>
  {
    const total = await this._taskModel.countDocuments({user:new mongoose.Types.ObjectId(userId),isDeleted:false});
    const completed = await this._taskModel.countDocuments({user: new mongoose.Types.ObjectId(userId),isDeleted:false, status: TASK_STATUS.COMPLETED});
    const pending = await this._taskModel.countDocuments({user: new mongoose.Types.ObjectId(userId), isDeleted: false,status: TASK_STATUS.PENDING});
    return {total,completed,pending};
  }
}
