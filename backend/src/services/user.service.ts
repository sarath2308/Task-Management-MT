import { HttpStatus } from "@/constant/http.status";
import { Messages } from "@/constant/message.constant";
import { AppError } from "@/error/app.error";
import { IUserRepo } from "@/interface/user.repo.interface";
import { IUserService } from "@/interface/user.service.interface";
import { TYPES } from "@/types/inversify/inversify.types";
import { CreateUserType } from "@/types/user/create.user.type";
import { UserFindByEmailResponse } from "@/types/user/user.login.response";
import { UserResponseType } from "@/types/user/user.response.type";
import { inject, injectable } from "inversify";

@injectable()
export class UserService implements IUserService 
{
    constructor(@inject(TYPES.IUserRepo) private _userRepo: IUserRepo){}

    async createUser(data: CreateUserType): Promise<UserResponseType>
    {
        const userData = await this._userRepo.create({name: data.name, email: data.email, passwordHash: data.passwordHash })

        if(!userData)
        {
            throw new AppError(Messages.USER_NOT_CREATED, HttpStatus.INTERNAL_SERVER_ERROR)
        }
        return {id: String(userData._id),name:userData.name,email: userData.email}

    }

    async checkEmailExist(email: string): Promise<boolean>
    {
        const check = await this._userRepo.findByEmail(email);
        if(!check) return false;
        return true;
    }

    async findByEmail(email: string): Promise<UserFindByEmailResponse | null>
    {
        const userData = await this._userRepo.findByEmail(email);

        if(!userData) return null;

        return { id: String(userData._id), name: userData.name, email: userData.email, passwordHash: userData.passwordHash};
    }
}