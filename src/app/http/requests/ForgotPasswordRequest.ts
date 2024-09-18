import { object, string } from "yup";

export const ForgotPasswordRequest = object({
  email: string().required().email(),
});
