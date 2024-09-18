import { Devices } from "@prisma/client";
import { object, ref, string } from "yup";

export const SignUpRequest = object({
  firstName: string().required(),
  lastName: string().required(),
  email: string().required().email(),
  password: string().required(),
  confirm_password: string()
    .required()
    .oneOf([ref("password")], "confirm password and password must be same"),
  deviceType: string().oneOf(Object.values(Devices)).required(),
  metaData: object(),
  fcmToken: string(),
});
