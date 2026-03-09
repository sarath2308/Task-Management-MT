import { ITokenService } from "@/utils/token.service";
import { Socket } from "socket.io";

export function socketAuthMiddleware(tokenService: ITokenService) {
  return async function (
    socket: Socket,
    next: (err?: Error) => void
  ): Promise<void> {
    console.log("🔐 SocketAuthMiddleware invoked");

    try {
      const cookie = socket.handshake.headers.cookie;
      console.log("🍪 cookies:", cookie);

      if (!cookie) {
        console.error("❌ No cookie header");
        return next(new Error("No cookie"));
      }

      const token = cookie
        .split("; ")
        .find((c) => c.startsWith("accessToken="))
        ?.split("=")[1];

      console.log("🎫 accessToken:", token ? "FOUND" : "MISSING");

      if (!token) {
        return next(new Error("No token"));
      }

      const user = await tokenService.verifyAccessToken(token);
      console.log("👤 token payload:", user);

      if (!user || !user.userId) {
        console.error("❌ Invalid user payload");
        return next(new Error("Invalid user"));
      }

      socket.data.user = user;

      console.log("✅ Socket authenticated:", user.userId);

      next();
    } catch (err) {
      console.error("❌ Socket auth failed:", err);
      next(new Error("Unauthorized"));
    }
  };
}