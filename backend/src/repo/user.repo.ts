import { IUserRepo } from "@/interface/user.repo.interface";
import { BaseRepo } from "./base/base";
import { IUser } from "@/model/user.mode";
import { inject, injectable } from "inversify";
import { TYPES } from "@/types/inversify/inversify.types";
import { Model } from "mongoose";

@injectable()
export class UserRepo extends BaseRepo<IUser> implements IUserRepo {
  constructor(@inject(TYPES.IUser) private _userModel: Model<IUser>) {
    super(_userModel);
  }
  async findByEmail(email: string): Promise<IUser | null> {
    return await this._userModel.findOne({ email: email });
  }
}
