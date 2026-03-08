import { TASK_STATUS } from "@/types/task/task.status.type";
import { Schema, model, Document, Types } from "mongoose";

export interface ITask extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  status: TASK_STATUS;
  dueDate?: Date;
  user: Types.ObjectId;
  isDeleted: boolean;
  createdAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    isDeleted: { type: Boolean, default: false },
    status: {
      type: String,
      default: TASK_STATUS.PENDING,
    },
    dueDate: {
      type: Date,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default model<ITask>("Task", taskSchema);
