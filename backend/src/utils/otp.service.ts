import crypto from "crypto";
import { inject, injectable } from "inversify";
import { TYPES } from "@/types/inversify/inversify.types";
import { IRedisRepository } from "@/repo/redis.repo";
import { AppError } from "@/error/app.error";
import { HttpStatus } from "@/constant/http.status";
import { Messages } from "@/constant/message.constant";
export interface IOtpService {
  generateOtp(): string;
  storeOtp(key: string, data: object, ttlSeconds: number): Promise<void>;
  verifyOtp(key: string, otp: string): Promise<OtpData>;
}

export interface OtpData {
  name: string;
  email: string;
  password: string;
  otp: string;
}

@injectable()
export class OtpService implements IOtpService {
  constructor(@inject(TYPES.IRedisRepo) private _redisRepo: IRedisRepository) {}
  generateOtp(length = 6): string {
    return Array.from(crypto.randomBytes(length))
      .map((byte) => (byte % 10).toString())
      .join("");
  }
  async storeOtp(
    key: string,
    data: OtpData,
    ttlSeconds: number,
  ): Promise<void> {
    await this._redisRepo.set<OtpData>(`${key}`, data, ttlSeconds);
  }
  async verifyOtp(key: string, otp: string): Promise<OtpData> {
    const match = await this._redisRepo.get<OtpData>(`${key}`);
    if (!match) {
      throw new AppError(Messages.OTP_EXPIRED, HttpStatus.BAD_REQUEST);
    }
    if (match?.otp !== otp) {
      throw new AppError(Messages.OTP_INVALID, HttpStatus.BAD_REQUEST);
    }
    await this._redisRepo.delete(key);
    return match;
  }
}
