import { Devices } from "@prisma/client";
import { object, string } from "yup";

export const LoginRequest = object({
  email: string().required().email(),
  password: string().required(),
  deviceType: string().oneOf(Object.values(Devices)).required(),
  metaData: object(),
  fcmToken: string(),
});
