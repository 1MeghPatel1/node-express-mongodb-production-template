import { object, string, ref } from "yup";

export const ResetPasswordRequest = object({
  password: string().required(),
  confirm_password: string()
    .required()
    .oneOf([ref("password")], "confirm password and password must be same"),
});
