import { getIO } from ".";

type NotificationPayload = {
  title: string;
  message: string;
};


export const emitToUser = async (
  userId: string,
  event: string,
  payload: NotificationPayload
): Promise<void> => {
  const io = getIO();

  const userRoom = `user:${userId}`; // keep consistent with socket join
  io.to(userRoom).emit(event, payload);
};