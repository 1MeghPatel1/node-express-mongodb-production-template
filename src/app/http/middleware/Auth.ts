import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../../env";
import dbConnection from "../../providers/db";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearerToken = req.headers["authorization"];
  let token = null;
  if (bearerToken) {
    token = bearerToken.split(" ")[1];
  }

  if (!token) {
    return res.status(401).send({
      status: false,
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, env.auth.secret);
    if (typeof decoded !== "string") {
      const device = await dbConnection.device.findFirst({
        where: {
          authToken: token,
          deletedAt: null,
        },
        include: {
          user: true,
        },
      });
      if (!device) {
        throw "Invalid Token";
      }
      req.body.auth = {
        bearerToken: token,
        device: device,
        user: device.user,
      };
    } else {
      throw "user not found";
    }
  } catch (err) {
    return res.status(401).send({
      status: false,
      message: "Invalid Token",
    });
  }
  return next();
};

export const verifyResetToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.query.token;

    if (!token || typeof token !== "string") {
      return res.status(401).send({
        status: false,
        message: req.t("user.token_not_found"),
      });
    }

    const decoded = jwt.verify(token, env.auth.secret);

    if (typeof decoded === "string") {
      return res.send({
        status: false,
        message: req.t("user.link_expired"),
      });
    }

    const user = await dbConnection.user.findFirst({
      where: {
        forgotPasswordToken: token,
      },
    });

    if (!user) {
      return res.send({
        status: false,
        message: req.t("user.link_expired"),
      });
    }

    req.body.auth = {
      token: token,
      user: user,
    };

    next();
  } catch (err) {
    return res.send({
      status: false,
      message: req.t("user.invalid_reset_link"),
    });
  }
};

export const verifyEmailToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.query.token;
    if (!token || typeof token !== "string") {
      return res.send({
        status: false,
        message: req.t("user.token_not_found"),
      });
    }
    const decoded = jwt.verify(token, env.auth.secret);
    if (typeof decoded === "string") {
      return res.send({
        status: false,
        message: req.t("user.link_expired"),
      });
    }

    console.log({ decoded });

    const user = await dbConnection.user.findUniqueOrThrow({
      where: {
        id: decoded.userId,
      },
    });

    req.body.auth = {
      token: token,
      user: user,
    };

    next();
  } catch (err) {
    return res.send({
      status: false,
      message: req.t("user.invalid_verify_link"),
    });
  }
};
