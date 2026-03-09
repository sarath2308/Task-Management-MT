import { HttpStatus } from "@/constant/http.status";
import { Messages } from "@/constant/message.constant";
import { AppError } from "@/error/app.error";
import { ITaskRepo } from "@/interface/task.repo.interface";
import { ITaskService } from "@/interface/task.service.interface";
import { TaskResponseMapper } from "@/mapper/task.response.mapper";
import { CreateTaskDataType } from "@/schema/task/task.create.schema";
import { TaskResponseType } from "@/schema/task/task.response.schema";
import { UpdateTaskDataType } from "@/schema/task/task.update.schema";
import { emitToUser } from "@/socket/emit.service";
import { TYPES } from "@/types/inversify/inversify.types";
import { TASK_STATUS } from "@/types/task/task.status.type";
import { inject, injectable } from "inversify";
import mongoose from "mongoose";

@injectable()
export class TaskService implements ITaskService {
  constructor(@inject(TYPES.ITaskRepo) private _taskRepo: ITaskRepo) {}

  async createTask(userId: string, data: CreateTaskDataType): Promise<void> {
    const available = await this._taskRepo.taskTitleAvailability(
      userId,
      data.title,
    );
    if (available) {
      throw new AppError(Messages.TASK_DUPLICATE, HttpStatus.BAD_REQUEST);
    }
    const userObjId = new mongoose.Types.ObjectId(userId);
    const createdTask = await this._taskRepo.create({
      title: data.title,
      description: data.description,
      user: userObjId,
    });
    if (!createdTask) {
      throw new AppError(
        Messages.TASK_NOT_CREATED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    emitToUser(userId,"task:created",{title: "task created", message: "task added to the list"})
  }
  async updateTask(taskId: string, data: UpdateTaskDataType): Promise<void> {
    const taskData = await this._taskRepo.findById(taskId);
    if(!taskData)
    {
        throw new AppError(Messages.TASK_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    if(data.title)
    {
    const duplicate = await this._taskRepo.taskTitleAvailabilityOnUpdate(taskId, String(taskData.user),data.title);
    if(duplicate)
    {
        throw new AppError(Messages.TASK_DUPLICATE, HttpStatus.BAD_REQUEST);
    }
    }
    taskData.title = data.title ?? taskData.description;
    taskData.description = data.description ?? taskData.description;
    await taskData.save();
      emitToUser(String(taskData.user),"task:updated",{title: "task updated", message: "task updated"})
  }
  async removeTask(taskId: string): Promise<void> {
     const taskData = await this._taskRepo.findById(taskId);
    if(!taskData)
    {
        throw new AppError(Messages.TASK_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    taskData.isDeleted = true;
    await taskData.save();

     emitToUser(String(taskData.user),"task:deleted",{title: "task removed", message: "task removed from the list"})
  }
  async getAllTaskOfUser(
    userId: string,
  ): Promise<{
    completedTasks: TaskResponseType[];
    pendingTask: TaskResponseType[];
  }> {
    const tasks = await this._taskRepo.getTasksByUser(userId);
    const completed = tasks.completed.map((task)=>
    {
        return TaskResponseMapper(task);
    })
      const pending = tasks.pending.map((task)=>
    {
        return TaskResponseMapper(task);
    })

    return{completedTasks: completed, pendingTask:pending}
  }
  async getTaskStatistics(
    userId: string,
  ): Promise<{ total: number; completed: number; pending: number }> {
     const statistics = await this._taskRepo.getStatistic(userId);
     return {...statistics};
  }

  async toggleStatus(taskId: string): Promise<void>
  {
    const taskData = await this._taskRepo.findById(taskId);
    if(!taskData)
    {
        throw new AppError(Messages.TASK_NOT_FOUND,HttpStatus.NOT_FOUND);
    }
    taskData.status = taskData.status === TASK_STATUS.COMPLETED? TASK_STATUS.PENDING:TASK_STATUS.COMPLETED;
    await taskData.save();
     emitToUser(String(taskData.user),"task:status",{title: "task status updated", message: "task status updated"})
  }
}
