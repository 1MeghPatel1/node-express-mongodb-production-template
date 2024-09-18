import { object, string } from "yup";

export const UpdateDeviceRequest = object({
  fcmToken: string(),
  metaData: object(),
});
