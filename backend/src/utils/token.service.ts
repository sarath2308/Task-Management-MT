import jwt, { JwtPayload, TokenExpiredError, SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";
import { injectable, inject } from "inversify";
import { IRedisRepository } from "@/repos/shared/redisRepo";
import { TYPES } from "../types/shared/inversify/types";
import { RedisKeys } from "@/constants/shared/redisKeys";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

type Tpayload = { userId: string; type?: string };

export interface ITokenService {
  signAccessToken(payload: Tpayload, expiresIn?: string): Promise<string>;
  generateRefreshToken(payload: Tpayload): string;
  verifyAccessToken(token: string): JwtPayload | null;
  verifyRefreshToken(token: string): Promise<JwtPayload | null>;
  generateTokens(payload: Tpayload): Promise<ITokens>;
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
  constructor(@inject(TYPES.IRedisRepository) private redisService: IRedisRepository) {}

  // ---------------- ACCESS TOKEN ----------------
  async signAccessToken(payload: Tpayload): Promise<string> {
    const jti = uuidv4();
    const options: SignOptions = {
      expiresIn: AuthConfig.accessTokenExpiresIn as any,
    };

    await this.redisService.set(
      `${RedisKeys.USER_TOKENS}${payload.userId}`,
      jti,
      Number(process.env.JTI_EXPIRES_IN) || 900,
    );

    return jwt.sign({ ...payload, jti }, AuthConfig.accessTokenSecret, options);
  }

  // ---------------- REFRESH TOKEN ----------------
  generateRefreshToken(payload: Tpayload): string {
    const options: SignOptions = {
      expiresIn: AuthConfig.refreshTokenExpiresIn as any,
    };

    const token = jwt.sign(payload, AuthConfig.refreshTokenSecret, options);

    const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60; // 7 days
    this.redisService.set(`${RedisKeys.REFRESH}:${payload.userId}`, token, REFRESH_TOKEN_TTL);

    return token;
  }

  // ---------------- VERIFY ACCESS ----------------
  verifyAccessToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, AuthConfig.accessTokenSecret) as JwtPayload;
    } catch {
      return null;
    }
  }

  // ---------------- VERIFY REFRESH ----------------
  async verifyRefreshToken(token: string): Promise<JwtPayload | null> {
    try {
      const payload = jwt.verify(token, AuthConfig.refreshTokenSecret) as JwtPayload;

      if (!payload || !payload.userId) return null;

      const storedToken = await this.redisService.get(`${RedisKeys.REFRESH}:${payload.userId}`);
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

  // ---------------- VERIFY TEMP TOKEN ----------------
}