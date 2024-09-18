import { Request, Response } from "express";
import { DeviceService } from "../../../../services/DeviceService";

export class DeviceController {
  public static async list(req: Request, res: Response) {
    const { user } = req.body.auth;
    const device = await DeviceService.devices(user.id);

    return res.send({
      status: true,
      data: device,
    });
  }

  public static async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const validatedData = req.body.validatedData;
    const { user } = req.body.auth;
    const response = await DeviceService.update(id, user.id, validatedData);

    if (response.count === 0) {
      return res.json({
        status: false,
        message: req.t("device.device_not_found"),
      });
    }

    const device = await DeviceService.find(id, user.id);

    return res.send({
      status: true,
      data: device,
      message: req.t("device.device_updated"),
    });
  }

  public static async delete(req: Request, res: Response) {
    const { user } = req.body.auth;
    const id = parseInt(req.params.id);
    const response = await DeviceService.delete(id, user.id);

    if (response.count === 0) {
      return res.json({
        status: false,
        message: req.t("device.device_not_found"),
      });
    }

    return res.send({
      status: true,
      message: req.t("device.device_deleted"),
    });
  }
}
