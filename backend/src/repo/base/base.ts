import { IBaseRepo } from "@/interface/base.repo.interface";
import { Model, HydratedDocument } from "mongoose";

export class BaseRepo<T> implements IBaseRepo<T> {
  constructor(protected model: Model<T>) {}

  async getAll(): Promise<HydratedDocument<T>[]> {
    try {
      return await this.model.find().exec();
    } catch (err) {
      console.error(err);
      throw new Error("Error occurred while fetching records");
    }
  }

  async create(data: Partial<T>): Promise<HydratedDocument<T>> {
    try {
      return await this.model.create(data);
    } catch (err) {
      console.error(err);
      throw new Error("Error occurred while creating record");
    }
  }

  async findById(id: string): Promise<HydratedDocument<T> | null> {
    try {
      return await this.model.findById(id).exec();
    } catch (err) {
      console.error(err);
      throw new Error("Error occurred while finding record");
    }
  }

  async update(
    id: string,
    data: Partial<T>,
  ): Promise<HydratedDocument<T> | null> {
    try {
      return await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
    } catch (err) {
      console.error(err);
      throw new Error("Error updating record");
    }
  }

  async delete(id: string): Promise<HydratedDocument<T> | null> {
    try {
      return await this.model.findByIdAndDelete(id).exec();
    } catch (err) {
      console.error(err);
      throw new Error("Error deleting record");
    }
  }
}
