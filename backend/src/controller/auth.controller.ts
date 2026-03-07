import { HttpStatus } from "@/constant/http.status";
import { IAuthService } from "@/interface/auth.service.interface";
import { setTokens } from "@/middleware/set.tokens";
import { TYPES } from "@/types/inversify/inversify.types";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class AuthController
{
    constructor(@inject(TYPES.IAuthService) private _authService: IAuthService){}
    async reqSignup(req:Request, res:Response): Promise<void>{
        console.log("reached controller");
        const result = await this._authService.reqSignup(req.body);
        res.status(HttpStatus.OK).json({success: true, tempToken: result.tempToken})
    }

    async verifyAndSignup(req:Request, res:Response): Promise<void>{
        const result = await this._authService.verifyAndSignup(req.body.email, req.body.otp);
        setTokens(res, result.accessToken, result.refreshToken);
        res.status(HttpStatus.OK).json({success: true});
    }

    async resendOtp(req:Request, res:Response): Promise<void>{
        await this._authService.resendOtp(req.body.email, req.body.tempToken)
        res.status(HttpStatus.OK).json({success: true })
    }

    async login(req:Request, res:Response): Promise<void>{
        const result = await this._authService.login(req.body);
        setTokens(res, result.accessToken, result.refreshToken);
        res.status(HttpStatus.OK).json({ success: true})
    }

}