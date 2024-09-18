import { Request, Response } from "express";
import { pagination } from "../../../../../utils/utils";
import dbConnection from "../../../../providers/db";
import { NotificationResponse } from "../../../responses/NotificationResponse";

export class NotificationController {
  public static async index(req: Request, res: Response) {
    const { user } = req.body.auth;
    const { page, perPage } = req.body.pagination;

    const totalCount = await dbConnection.notification.count({
      where: {
        userId: user.id,
      },
    });

    const notifications =
      totalCount > 0
        ? await dbConnection.notification.findMany({
            where: {
              userId: user.id,
            },
            skip: perPage * (page - 1),
            take: perPage,
          })
        : [];

    if (notifications.length > 0) {
      await dbConnection.notification.updateMany({
        where: {
          userId: user.id,
          readAt: null,
        },
        data: {
          readAt: new Date(),
        },
      });
    }

    return res.json({
      status: true,
      data: NotificationResponse(notifications),
      pagination: pagination(totalCount, perPage, page),
    });
  }

  public static async delete(req: Request, res: Response) {
    const { user } = req.body.auth;
    const id = req.params.id;

    await dbConnection.notification.deleteMany({
      where: {
        id: id,
        userId: user.id,
      },
    });

    return res.json({
      status: true,
      message: req.t("user.single_notification_deleted"),
    });
  }

  public static async deleteAll(req: Request, res: Response) {
    const { user } = req.body.auth;

    await dbConnection.notification.deleteMany({
      where: {
        userId: user.id,
      },
    });

    return res.json({
      status: true,
      message: req.t("user.notification_deleted"),
    });
  }
}
