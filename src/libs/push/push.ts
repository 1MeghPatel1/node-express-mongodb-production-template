import {
  MessagingDevicesResponse,
  MessagingPayload,
} from "firebase-admin/lib/messaging/messaging-api";
import * as admin from "firebase-admin";
import { logger } from "../../app/providers/logger";

type Props = {
  tokens: string[];
};

export class PushNotification {
  registrationTokens: string[];
  constructor({ tokens }: Props) {
    this.registrationTokens = tokens;
  }

  public async send(
    data: MessagingPayload
  ): Promise<string | MessagingDevicesResponse> {
    try {
      if (!admin.apps.length) {
        admin.initializeApp();
      }
      return await admin
        .messaging()
        .sendToDevice(this.registrationTokens, data);
    } catch (error: any) {
      logger.error(`fcm send error ${error.message}`);
      return error.message as string;
    }
  }
}
