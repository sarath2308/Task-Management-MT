import { LoginDataType } from "@/schema/login.schema";
import { SignUpDataType } from "@/schema/signup.schema";

export interface IAuthService {
    reqSignup:(data: SignUpDataType) => Promise<{tempToken: string}>;
    verifyAndSignup:(email: string,otp: string) => Promise<{accessToken: string, refreshToken: string}>;
    resendOtp:(email: string, tempToken: string) => Promise<void>;
    login:(data: LoginDataType) => Promise<{accessToken: string, refreshToken: string}>;
}
