import { IAuthService } from "@/interface/auth.service.interface";
import { IpasswordService } from "@/interface/password.service.interface";
import { IUserRepo } from "@/interface/user.repo.interface";
import { TYPES } from "@/types/inversify/inversify.types";
import { inject, injectable } from "inversify";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.IPasswordService) private _passwordService: IpasswordService,
    @inject(TYPES.IUserService) private _userService: IUserRepo,
  ) {}
}
