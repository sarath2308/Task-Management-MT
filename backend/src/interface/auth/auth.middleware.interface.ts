import { Response, NextFunction } from "express";
import { IAuthRequest } from "./auth.request.interface";

export interface IAuthenticateMiddleware {
  handle: (req: IAuthRequest, res: Response, next: NextFunction) => void;
}