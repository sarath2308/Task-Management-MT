import { CreateUserType } from "@/types/user/create.user.type";
import { UserFindByEmailResponse } from "@/types/user/user.login.response";
import { UserResponseType } from "@/types/user/user.response.type";

export interface IUserService 
{
    createUser:(data: CreateUserType) => Promise<UserResponseType>;
    checkEmailExist:(email: string) => Promise<boolean>;
    findByEmail: (email: string) => Promise<UserFindByEmailResponse | null>;
}