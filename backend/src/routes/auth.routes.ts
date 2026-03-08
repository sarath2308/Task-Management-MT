import { AuthController } from "@/controller/auth.controller";
import container from "@/di/di.container";
import { IAuthenticateMiddleware } from "@/interface/auth/auth.middleware.interface";
import { validateRequest } from "@/middleware/zod.validation.middleware";
import { loginSchema } from "@/schema/login.schema";
import { SignupOtpResendSchema } from "@/schema/signup.otp.resend.schema";
import { VerifyAndSignupSchema } from "@/schema/signup.otp.verfication.schema";
import { signupSchema } from "@/schema/signup.schema";
import { TYPES } from "@/types/inversify/inversify.types";
import { Router } from "express";

export const AuthRoutes = (controller: AuthController) => {
  const authorize = container.get<IAuthenticateMiddleware>(
    TYPES.IAuthMiddleware,
  );
  const router = Router();

  router.post(
    "/req-signup",
    validateRequest(signupSchema),
    controller.reqSignup.bind(controller),
  );
  router.post(
    "/verify-otp",
    validateRequest(VerifyAndSignupSchema),
    controller.verifyAndSignup.bind(controller),
  );

  router.post(
    "/resend-otp",
    validateRequest(SignupOtpResendSchema),
    controller.resendOtp.bind(controller),
  );
  router.post(
    "/login",
    validateRequest(loginSchema),
    controller.login.bind(controller),
  );

  router.get(
    "/me",
    authorize.handle.bind(authorize),
    controller.checkUser.bind(controller),
  );

  return router;
};
