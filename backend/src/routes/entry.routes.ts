import { Router } from "express";
import { AuthRoutes } from "./auth.routes";
import container from "@/di/di.container";
import { TYPES } from "@/types/inversify/inversify.types";
import { wrapAsyncController } from "@/utils/wrap.async.controller";
import { AuthController } from "@/controller/auth.controller";

export function EntryRoutes()
{
    const router = Router();

    const authController = wrapAsyncController(container.get<AuthController>(TYPES.AuthController));

    router.use("/auth", AuthRoutes(authController));

    return router;
}