import { env } from "../../env";
import * as jwt from "jsonwebtoken";
import dbConnection from "../providers/db";
import { Device, Devices, NotificationTypes } from "@prisma/client";
import { Notification } from "../notification/Notification";
import { PushNotificationChannels } from "../../utils/types";

export class DeviceService {
  public static async create(
    userId: string,
    deviceType: Devices,
    fcmToken?: string,
    metaData?: any
  ): Promise<Device> {
    const token = await jwt.sign({ userId: userId }, env.auth.secret, {
      expiresIn: env.auth.expiresIn,
    });
    if (typeof token === "undefined") {
      throw "Could not create token";
    }

    return await dbConnection.device.create({
      data: {
        authToken: token,
        fcmToken: fcmToken,
        metaData: metaData !== null ? metaData : {},
        device: deviceType,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  public static async find(deviceId: string, userId: string) {
    return await dbConnection.device.findFirst({
      where: {
        id: deviceId,
        userId: userId,
      },
    });
  }

  public static async delete(deviceId: string, userId: string) {
    const device = await dbConnection.device.findFirst({
      where: {
        id: deviceId,
      },
    });

    if (device?.fcmToken) {
      const payload = {};
      await new Notification(
        [PushNotificationChannels.PUSH],
        payload,
        NotificationTypes.LoggedOut,
        [device.fcmToken]
      ).send();
    }

    return await dbConnection.device.deleteMany({
      where: {
        id: deviceId,
        userId: userId,
        deletedAt: null,
      },
    });
  }

  public static async update(id: string, userId: string, data: any) {
    return await dbConnection.device.updateMany({
      where: {
        id: id,
        userId: userId,
        deletedAt: null,
      },
      data: data,
    });
  }

  public static async devices(userId: string): Promise<Device[]> {
    return await dbConnection.device.findMany({
      where: {
        user: {
          id: userId,
        },
        deletedAt: null,
      },
    });
  }
}
