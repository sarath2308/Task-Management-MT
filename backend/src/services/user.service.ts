import { IUserRepo } from "@/interface/user.repo.interface";
import { IUserService } from "@/interface/user.service.interface";
import { TYPES } from "@/types/inversify/inversify.types";
import { inject, injectable } from "inversify";

@injectable()
export class UserService implements IUserService 
{
    constructor(@inject(TYPES.IUserRepo) private _userRepo: IUserRepo){}

    async createUser(): Promise<void>
    {
        
    }
}