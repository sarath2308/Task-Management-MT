import express from "express";
import { loadConfigFromSSM } from "./config/ssm/ssm";
import { connectDB } from "./config/mongodb/mongo";
import { connectRedis } from "./config/redis/redis";
import cookieParser from "cookie-parser";
import { urlencoded } from "express";
import cors from "cors";
import http from "http";

const app = express();

async function startServer() {
  await loadConfigFromSSM();
  await connectDB();
  await connectRedis();
  const server = http.createServer();

  app.use(cookieParser());
  app.use(urlencoded({ extended: true }));

  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    }),
  );

  const PORT: number = Number(process.env.PORT) || 5000;
  server.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`),
  );
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
