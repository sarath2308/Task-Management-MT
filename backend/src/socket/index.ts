import { Server } from "socket.io";
import { Server as HttpServer } from "http";

import container from "@/di/di.container";
import { socketAuthMiddleware } from "@/middleware/socket.auth.middleware";
import { ITokenService } from "@/utils/token.service";
import { TYPES } from "@/types/inversify/inversify.types";
import { registerSocket } from "./socket.handler";

let io: Server | null = null;

export const initSocket = (server: HttpServer): void => {

  const tokenService = container.get<ITokenService>(TYPES.ITokenService);

  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
    connectionStateRecovery: {},
  });

  // Global auth middleware
  io.use(socketAuthMiddleware(tokenService));

  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);
    registerSocket(io!, socket);
  });
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};