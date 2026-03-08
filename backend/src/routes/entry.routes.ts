import { Router } from "express";
import { AuthRoutes } from "./auth.routes";
import container from "@/di/di.container";
import { TYPES } from "@/types/inversify/inversify.types";
import { wrapAsyncController } from "@/utils/wrap.async.controller";
import { AuthController } from "@/controller/auth.controller";
import { IAuthenticateMiddleware } from "@/interface/auth/auth.middleware.interface";
import { TaskRoutes } from "./task.routes";
import { TaskController } from "@/controller/task.controller";

export function EntryRoutes() {
  const router = Router();
  const authorize = container.get<IAuthenticateMiddleware>(
    TYPES.IAuthMiddleware,
  );
  const authController = wrapAsyncController(
    container.get<AuthController>(TYPES.AuthController),
  );
  const taskController = wrapAsyncController(container.get<TaskController>(TYPES.TaskController));

  router.use("/auth", AuthRoutes(authController));
  router.use("/task", authorize.handle.bind(authorize),TaskRoutes(taskController));

  return router;
}
