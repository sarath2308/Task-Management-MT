import { HydratedDocument } from "mongoose";

export interface IBaseRepo<T> {
  getAll(): Promise<HydratedDocument<T>[]>;
  create(data: Partial<T>): Promise<HydratedDocument<T>>;
  findById(id: string): Promise<HydratedDocument<T> | null>;
  update(id: string, data: Partial<T>): Promise<HydratedDocument<T> | null>;
  delete(id: string): Promise<HydratedDocument<T> | null>;
}
