import { Request, Response } from "express";
import { env } from "../../../../../env";
import dbConnection from "../../../../providers/db";
import jwt from "jsonwebtoken";
// import { forgotPasswordEmailQueue } from "../../../../jobs/ForgotMailSend";
import bcrypt from "bcryptjs";

export class ForgotPasswordController {
  public static async forgot(req: Request, res: Response) {
    const { email } = req.body.validatedData;

    const user = await dbConnection.user.findFirst({
      where: {
        email: email,
        deletedAt: null,
      },
    });

    if (!user) {
      return res.json({
        status: false,
        message: "User not found",
      });
    }

    if (user.socialId) {
      return res.json({
        status: false,
        message: "Please login with your social account",
      });
    }

    const token = await jwt.sign({ userId: user.id }, env.auth.secret, {
      expiresIn: env.auth.forgotPasswordExpiredIn,
    });

    await dbConnection.user.update({
      where: {
        id: user.id,
      },
      data: {
        forgotPasswordToken: token,
      },
    });

    const url = `${env.app.host}:${env.app.port}/reset-password?token=${token}`;
    const subject = "Reset your password";
    const data = {
      email,
      url,
      subject,
    };

    // forgotPasswordEmailQueue.add("sendForgotPasswordEmail", data);

    return res.json({
      status: true,
      message: req.t("user.forgot_password_reset_link"),
    });
  }

  public static async checkResetToken(req: Request, res: Response) {
    return res.send({
      status: true,
    });
  }

  public static async resetPassword(req: Request, res: Response) {
    const { password } = req.body.validatedData;
    const { user } = req.body.auth;

    await dbConnection.user.update({
      where: {
        id: user.id,
      },
      data: {
        forgotPasswordToken: null,
        password: await bcrypt.hashSync(password),
      },
    });

    //TODO delete all the previous devices and lot out all devices

    return res.send({
      status: true,
      message: req.t("user.password_reset_success"),
    });
  }
}
