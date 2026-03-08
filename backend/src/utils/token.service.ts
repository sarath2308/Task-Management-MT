import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";
import { injectable, inject } from "inversify";
import { IRedisRepository } from "@/repo/redis.repo";
import { TYPES } from "@/types/inversify/inversify.types";
import { RedisKeys } from "@/constant/redis.keys.constant";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

type Tpayload = { userId: string; type?: string };

export interface ITokenService {
  signAccessToken(payload: Tpayload, expiresIn?: string): Promise<string>;
  generateRefreshToken(payload: Tpayload): string;
  verifyAccessToken(token: string): JwtPayload | null;
  verifyRefreshToken(token: string): Promise<JwtPayload | null>;
  generateTokens(payload: Tpayload): Promise<ITokens>;
  generateTempToken: (payload: { email: string }) => Promise<string>;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface ITempTokenRes {
  success: boolean;
  message: string;
  data: Tpayload;
}

@injectable()
export class TokenService implements ITokenService {
  constructor(
    @inject(TYPES.IRedisRepo) private _redisService: IRedisRepository,
  ) {}

  // ---------------- ACCESS TOKEN ----------------
  async signAccessToken(payload: Tpayload): Promise<string> {
    const jti = uuidv4();
    const options: SignOptions = {
      expiresIn: "15m",
    };

    await this._redisService.set(
      `${RedisKeys.USER_TOKENS}${payload.userId}`,
      jti,
      Number(process.env.JTI_EXPIRES_IN) || 900,
    );

    return jwt.sign(
      { ...payload, jti },
      process.env.ACCESS_TOKEN_SECRET!,
      options,
    );
  }

  // ---------------- REFRESH TOKEN ----------------
  generateRefreshToken(payload: Tpayload): string {
    const options: SignOptions = {
      expiresIn: "1h",
    };

    const token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, options);

    const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60; // 7 days
    this._redisService.set(
      `${RedisKeys.REFRESH}:${payload.userId}`,
      token,
      REFRESH_TOKEN_TTL,
    );

    return token;
  }

  // ---------------- VERIFY ACCESS ----------------
  verifyAccessToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload;
    } catch {
      return null;
    }
  }

  // ---------------- VERIFY REFRESH ----------------
  async verifyRefreshToken(token: string): Promise<JwtPayload | null> {
    try {
      const payload = jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET!,
      ) as JwtPayload;

      if (!payload || !payload.userId) return null;

      const storedToken = await this._redisService.get(
        `${RedisKeys.REFRESH}:${payload.userId}`,
      );
      if (storedToken !== token) return null;

      return payload;
    } catch {
      return null;
    }
  }

  // ---------------- GENERATE BOTH TOKENS ----------------
  async generateTokens(payload: Tpayload): Promise<ITokens> {
    return {
      accessToken: await this.signAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  async generateTempToken(payload: { email: string }): Promise<string> {
    const options: SignOptions = { expiresIn: "5m" };
    return jwt.sign({ ...payload }, process.env.ACCESS_TOKEN_SECRET!, options);
  }

  // ---------------- VERIFY TEMP TOKEN ----------------
}
