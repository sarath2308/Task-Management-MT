import { Server, Socket } from "socket.io";

const categoryQueues: Record<string, string[]> = {};

export function registerSocket(io: Server, socket: Socket) {
  debugConnection(socket);

  const userId = authenticateSocket(socket);
  if (!userId) return;

  joinUserRoom(socket, userId);

  handleDisconnect(socket);
}

function debugConnection(socket: Socket) {
  console.log("🟢 SOCKET CONNECTED");
  console.log("socket.id:", socket.id);
  console.log("namespace:", socket.nsp.name);
  console.log("handshake url:", socket.handshake.url);
}

function authenticateSocket(socket: Socket): string | null {
  const user = socket.data?.user;

  if (!user?.userId) {
    socket.emit("chat:error", "Unauthenticated socket");
    socket.disconnect();
    return null;
  }

  return user.userId;
}

function joinUserRoom(socket: Socket, userId: string) {
  const userRoom = `user:${userId}`;
  socket.join(userRoom);
}

function handleDisconnect(socket: Socket) {
  socket.on("disconnect", (reason) => {
    for (const key in categoryQueues) {
      categoryQueues[key] = categoryQueues[key].filter(
        (id) => id !== socket.id
      );
    }

    console.warn("🔌 SOCKET DISCONNECTED:", reason);
  });
}