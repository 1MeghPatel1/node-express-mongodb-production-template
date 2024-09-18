import { SocialTypes } from "@prisma/client";
import { Request, Response } from "express";
import { DeviceService } from "../../../../services/DeviceService";
import { SocialService } from "../../../../services/SocialService";
import { UserResponse } from "../../../responses/UserResponse";

export class SocialLoginController {
  public static async socialLogin(req: Request, res: Response) {
    const { auth } = req.body;
    const { socialType, deviceType, fcmToken, firstName, lastName, metaData } =
      req.body.validatedData;
    let email = null;

    if (socialType === SocialTypes.APPLE) {
      const appleAccountDetails = await SocialService.getAppleDetails(auth.sub);
      if (!appleAccountDetails && !auth.email) {
        return res.status(401).send({
          status: false,
          message: req.t("user.apple_error"),
        });
      }

      if (!appleAccountDetails) {
        email = auth.email;
        await SocialService.createAppleDetails(
          firstName,
          lastName,
          email,
          auth.sub
        );
      } else {
        email = appleAccountDetails.email;
      }
    } else {
      email = auth.email;
    }

    const user = await SocialService.socialLogin(
      auth.sub,
      socialType,
      email,
      firstName,
      lastName
    );
    const device = await DeviceService.create(
      user.id,
      deviceType,
      fcmToken ?? null,
      metaData ?? {}
    );

    return res.send({
      status: true,
      data: UserResponse(user),
      accessToken: device.authToken,
      message: req.t("user.logged_in"),
    });
  }
}
