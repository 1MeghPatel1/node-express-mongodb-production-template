import { Devices, SocialTypes } from "@prisma/client";
import { object, string } from "yup";

export const SocialLoginRequest = object({
  firstName: string().required(),
  lastName: string().required(),
  socialId: string().required(),
  socialType: string().required().oneOf(Object.values(SocialTypes)),
  socialToken: string().required(),
  deviceType: string().oneOf(Object.values(Devices)).required(),
  metaData: object(),
  fcmToken: string(),
});
