import { IUser } from "@/model/user.mode";
import { IBaseRepo } from "./base.repo.interface";

export interface IUserRepo extends IBaseRepo<IUser> {
  findByEmail: (email: string) => Promise<IUser | null>;
}
