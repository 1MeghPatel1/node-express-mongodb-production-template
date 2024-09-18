import { NotificationTypes } from "@prisma/client";
import { MessagingPayload } from "firebase-admin/lib/messaging/messaging-api";
import { PushNotificationChannels } from "../../utils/types";
import dbConnection from "../providers/db";
// import { defaultMailSendQueue } from "../jobs/DefaultMailSend";
// import { sendPushNotificationQueue } from "../jobs/PushNotificationSend";
import { sendPushNotificationType } from "../../utils/types";

export class Notification {
  public channels: PushNotificationChannels[];
  public fcmTokens?: string[];
  public userId?: number;
  public messagePayload: MessagingPayload;
  public type: NotificationTypes;

  constructor(
    channels: PushNotificationChannels[],
    messagePayload: MessagingPayload,
    type: NotificationTypes,
    fcmTokens?: string[],
    userId?: number
  ) {
    this.channels = channels;
    this.userId = userId;
    this.fcmTokens = fcmTokens;
    this.messagePayload = messagePayload;
    this.type = type;
  }

  public async send() {
    if (this.channels.includes(PushNotificationChannels.PUSH)) {
      await this.sendPushNotification();
    }
    if (this.channels.includes(PushNotificationChannels.MAIL)) {
      await this.sendMailNotification();
    }
    if (this.channels.includes(PushNotificationChannels.DATABASE)) {
      await this.saveToDb();
    }
  }

  public async saveToDb() {
    if (this.messagePayload.data && this.userId) {
      return await dbConnection.notification.create({
        data: {
          body: this.messagePayload.data.body,
          title: this.messagePayload.data.title,
          type: this.type,
          userId: this.userId,
          data: this.messagePayload.data.data,
        },
      });
    }
  }

  public async sendPushNotification() {
    if (typeof this.fcmTokens !== "undefined" && this.fcmTokens?.length > 0) {
      const data: sendPushNotificationType = {
        fcmTokens: this.fcmTokens,
        messagePayload: this.messagePayload,
      };
      // sendPushNotificationQueue.add("sendPushNotification", data);
    }
  }

  public async sendMailNotification() {
    const data = {
      email: this.messagePayload.data?.email,
      title: this.messagePayload.data?.title,
      body: this.messagePayload.data?.body,
    };

    // defaultMailSendQueue.add("defaultMailSend", data);
  }
}
