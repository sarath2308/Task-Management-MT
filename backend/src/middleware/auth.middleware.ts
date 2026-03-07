import { injectable, inject } from "inversify";
import { Response, NextFunction } from "express";
import { ITokenService } from "@/utils/token.service";
import { HttpStatus } from "@/constant/http.status";
import { TYPES } from "@/types/inversify/inversify.types";
import { Messages } from "@/constant/message.constant";
import { IAuthRequest } from "@/interface/auth/auth.request.interface";
import { IAuthenticateMiddleware } from "@/interface/auth/auth.middleware.interface";

@injectable()
export class AuthenticateMiddleware implements IAuthenticateMiddleware {
  constructor(
    @inject(TYPES.ITokenService) private _tokenService: ITokenService,
  ) {}

  async handle(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    const token = req.cookies["accessToken"];
    if (!token) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: `${Messages.UNAUTHORIZED}` });
      return;
    }

    try {
      const decoded = (await this._tokenService.verifyAccessToken(token)) as {
        userId: string;
      };


      req.user = decoded;
      next();
    } catch (err: unknown) {
      console.error(err);
      // Narrow the error type
      const error = err as { name?: string };

      if (error.name === "TokenExpiredError") {
        // Token expired → frontend can call refresh
        res.status(HttpStatus.UNAUTHORIZED).json({ message: `${Messages.UNAUTHORIZED}` });
      } else {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: `${Messages.UNAUTHORIZED}` });
      }
    }
  }
}