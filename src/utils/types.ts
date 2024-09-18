import { MessagingPayload } from "firebase-admin/lib/messaging/messaging-api";

export enum PushNotificationChannels {
  DATABASE = "db",
  PUSH = "fcm",
  MAIL = "mail",
}

export enum CronEnums {
  EVERY_MINUTE = "* * * * * ",
  EVERY_FIVE_MINUTES = "*/5 * * * * ",
  EVERY_10_MINUTES = "*/10 * * * * ",
  EVERY_15_MINUTES = "*/15 * * * * ",
  EVERY_30_MINUTES = "*/30 * * * *",
  EVERY_HOUR = "0 * * * *",
  EVERYDAY_MIDNIGHT = "0 0 * * *",
}

export type sendPushNotificationType = {
  fcmTokens: string[];
  messagePayload: MessagingPayload;
};

export interface SendMailType {
  subject: string;
  email: string;
}

export interface SendLeaveAppliedMailType extends SendMailType {
  startDate: Date;
  endDate: Date;
  fullName: string;
  otherUserFullName: string;
  count: number;
}
export interface SendMemberAddedMailType extends SendMailType {
  fullName: string;
  otherUserFullName: string;
}
export interface SendLeaveResponseType extends SendMailType {
  fullName: string;
  startDate: string;
  endDate: string;
  status: string;
}

export enum UPLOAD_TYPES {
  IMAGE,
  VIDEO,
  FILE,
}

export const ALLOWED_IMAGE_TYPE = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

export const ALLOWED_VIDEO_TYPE = ["video/mp4"];

export const ALLOWED_FILE_TYPES = ["application/pdf"];
