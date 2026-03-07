import { AuthController } from "@/controller/auth.controller";
import { validateRequest } from "@/middleware/zod.validation.middleware";
import { loginSchema } from "@/schema/login.schema";
import { SignupOtpResendSchema } from "@/schema/signup.otp.resend.schema";
import { VerifyAndSignupSchema } from "@/schema/signup.otp.verfication.schema";
import { signupSchema } from "@/schema/signup.schema";
import { Router } from "express";

export const AuthRoutes = (controller: AuthController) =>
{
  const router = Router();

  router.post("/req-signup", validateRequest(signupSchema), controller.reqSignup.bind(controller));
  router.post("/verify-otp", validateRequest(VerifyAndSignupSchema), controller.verifyAndSignup.bind(controller));

  router.post("/resend-otp", validateRequest(SignupOtpResendSchema), controller.resendOtp.bind(controller));
  router.post("/login", validateRequest(loginSchema), controller.login.bind(controller));

  return router;
}