import { HttpStatus } from "@/constant/http.status";
import { Messages } from "@/constant/message.constant";
import { RedisKeys } from "@/constant/redis.keys.constant";
import { AppError } from "@/error/app.error";
import { IAuthService } from "@/interface/auth.service.interface";
import { IEmailService } from "@/interface/emai.service.interface";
import { IpasswordService } from "@/interface/password.service.interface";
import { IUserService } from "@/interface/user.service.interface";
import { IRedisRepository } from "@/repo/redis.repo";
import { LoginDataType } from "@/schema/login.schema";
import { SignUpDataType } from "@/schema/signup.schema";
import { TYPES } from "@/types/inversify/inversify.types";
import { IOtpService } from "@/utils/otp.service";
import { ITokenService } from "@/utils/token.service";
import { inject, injectable } from "inversify";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.IPasswordService) private _passwordService: IpasswordService,
    @inject(TYPES.IUserService) private _userService: IUserService,
    @inject(TYPES.IOtpService) private _otpService: IOtpService,
    @inject(TYPES.IRedisRepo) private _redisRepo: IRedisRepository,
    @inject(TYPES.IEmailService) private _emailService: IEmailService,
    @inject(TYPES.ITokenService) private _tokenService: ITokenService,
  ) {}

  async reqSignup(data: SignUpDataType): Promise<{ tempToken: string }> {
    const check = await this._userService.checkEmailExist(data.email);
    if (check) {
      throw new AppError(Messages.EMAIL_EXISTS, HttpStatus.BAD_REQUEST);
    }

    const otp = await this._otpService.generateOtp();
    await this._otpService.storeOtp(
      `${RedisKeys.SIGNUP}:${data.email}`,
      { ...data, otp },
      60,
    );
    const tempToken = await this._tokenService.generateTempToken({
      email: data.email,
    });
    await this._redisRepo.set<SignUpDataType>(
      `${RedisKeys.RESET_TOKEN}:${tempToken}`,
      data,
      180,
    );
    await this._emailService.sendSignupOtp(data.email, otp);
    return { tempToken };
  }
  async verifyAndSignup(
    email: string,
    otp: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const verify = await this._otpService.verifyOtp(
      `${RedisKeys.SIGNUP}:${email}`,
      otp,
    );
    if (!verify) {
      throw new AppError(Messages.OTP_INVALID, HttpStatus.BAD_REQUEST);
    }
    const hashPassword = await this._passwordService.hashPassword(
      verify.password,
    );
    const createdUser = await this._userService.createUser({
      name: verify.name,
      email: verify.email,
      passwordHash: hashPassword,
    });
    const tokens = await this._tokenService.generateTokens({
      userId: createdUser.id,
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
  async resendOtp(email: string, tempToken: string): Promise<void> {
    const timeExceed = await this._redisRepo.get<SignUpDataType>(
      `${RedisKeys.RESET_TOKEN}:${tempToken}`,
    );
    if (!timeExceed) {
      throw new AppError(Messages.TIME_EXCEEDED, HttpStatus.BAD_REQUEST);
    }
    const otp = await this._otpService.generateOtp();
    await this._otpService.storeOtp(
      `${RedisKeys.SIGNUP}:${timeExceed.email}`,
      { ...timeExceed, otp },
      60,
    );
    await this._emailService.sendSignupOtp(email, otp);
  }
  async login(
    data: LoginDataType,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const userData = await this._userService.findByEmail(data.email);
    if (!userData) {
      throw new AppError(Messages.INVALID_CREDENTIALS, HttpStatus.NOT_FOUND);
    }

    const check = await this._passwordService.comparePassword(
      userData.passwordHash,
      data.password,
    );
    if (!check) {
      throw new AppError(Messages.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
    }

    const tokens = await this._tokenService.generateTokens({
      userId: userData.id,
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}
