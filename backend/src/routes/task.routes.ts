import { TaskController } from "@/controller/task.controller";
import { validateRequest } from "@/middleware/zod.validation.middleware";
import { CreateTaskSchema } from "@/schema/task/task.create.schema";
import { RemoveTaskSchema } from "@/schema/task/task.remove.schema";
import { UpdateTaskSchema } from "@/schema/task/task.update.schema";
import { Router } from "express";

export const TaskRoutes = (controller: TaskController) =>
{
    const router = Router();

    router.post("/", validateRequest(CreateTaskSchema), controller.createTask.bind(controller));
    router.patch("/:taskId", validateRequest(UpdateTaskSchema), controller.updateTask.bind(controller));
    router.delete("/:taskId",validateRequest(RemoveTaskSchema), controller.removeTask.bind(controller));
    router.get("/",controller.getAllTaskOfUser.bind(controller));
    router.get("/statistics", controller.getStatistics.bind(controller));
    router.patch("/status/:taskId", controller.toggleStatus.bind(controller));

    return router;
}