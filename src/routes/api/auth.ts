import { Router } from "express";
import { AuthController } from "../../app/http/controllers/api/Auth/AuthController";
import { RequestValidator } from "../../app/http/middleware/RequestValidator";
import { LoginRequest } from "../../app/http/requests/LoginRequest";
import { SignUpRequest } from "../../app/http/requests/SignUpRequest";
import { verifyEmailToken, verifyResetToken, verifyToken } from "../../app/http/middleware/Auth";
import { ForgotPasswordController } from "../../app/http/controllers/api/Auth/ForgotPasswordController";
import { ForgotPasswordRequest } from "../../app/http/requests/ForgotPasswordRequest";
import { ResetPasswordRequest } from "../../app/http/requests/ResetPasswordRequest";
import { SocialLoginController } from "../../app/http/controllers/api/Auth/SocialLoginController";
import { verifySocialLogin } from "../../app/http/middleware/SocialAuth";
import { SocialLoginRequest } from "../../app/http/requests/SocialLoginRequest";
import { getMetadata } from "../../app/http/middleware/GetMetadata";

const router = Router();

router.post("/login", RequestValidator(LoginRequest), AuthController.login);

router.post("/signup", getMetadata, RequestValidator(SignUpRequest), AuthController.signUp);

router.get("/verify", verifyEmailToken, AuthController.verify);

router.get("/profile", verifyToken, AuthController.profile);

router.post(
  "/social-login",
  RequestValidator(SocialLoginRequest),
  verifySocialLogin,
  SocialLoginController.socialLogin
);

router.post(
  "/forgot-password",
  RequestValidator(ForgotPasswordRequest),
  ForgotPasswordController.forgot
);

router.get(
  "/reset-password",
  verifyResetToken,
  ForgotPasswordController.checkResetToken
);

router.post(
  "/reset-password",
  RequestValidator(ResetPasswordRequest),
  verifyResetToken,
  ForgotPasswordController.resetPassword
);

router.get("/logout", verifyToken, AuthController.logOut);

export default router;
