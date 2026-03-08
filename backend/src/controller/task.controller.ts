import { HttpStatus } from "@/constant/http.status";
import { IAuthRequest } from "@/interface/auth/auth.request.interface";
import { ITaskService } from "@/interface/task.service.interface";
import { TYPES } from "@/types/inversify/inversify.types";
import { Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class TaskController
{
    constructor(@inject(TYPES.ITaskService) private _taskService: ITaskService){}

    async createTask(req:IAuthRequest, res: Response): Promise<void>
    {
       const userId = req.user?.userId as string;
       await this._taskService.createTask(userId,req.body);
       res.status(HttpStatus.CREATED).json({success: true})
    }
    async updateTask(req:IAuthRequest, res: Response): Promise<void>
    {
        const taskId = req.params.taskId as string;
        await this._taskService.updateTask(taskId,req.body);
        res.status(HttpStatus.OK).json({success: true});
    }
   async removeTask(req:IAuthRequest, res: Response): Promise<void>
    {
        const taskId = req.params.taskId as string;
        await this._taskService.removeTask(taskId);
        res.status(HttpStatus.OK).json({success: true});
    }
    async getAllTaskOfUser(req: IAuthRequest, res: Response): Promise<void>
    {
      const userId = req.user?.userId as string;
      const result = await this._taskService.getAllTaskOfUser(userId);
      res.status(HttpStatus.OK).json({success: true, completedTask: result.completedTasks, pendingTask: result.pendingTask});
    }

    async getStatistics(req: IAuthRequest, res: Response): Promise<void>
    {
       const userId = req.user?.userId as string;
       const result = await this._taskService.getTaskStatistics(userId);
       res.status(HttpStatus.OK).json({success: true, total: result.total, completed: result.completed, pending: result.pending})
    }
    async toggleStatus(req: IAuthRequest, res: Response): Promise<void>
    {
       const taskId = req.params.taskId as string;
       await this._taskService.toggleStatus(taskId);
       
       res.status(HttpStatus.OK).json({success: true })
    }
}