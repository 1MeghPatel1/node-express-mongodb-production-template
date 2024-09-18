import { SocialTypes } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { JwksClient } from "jwks-rsa";
import { env } from "../../../env";

export const verifySocialLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { socialType, socialToken } = req.body.validatedData;

  try {
    let auth = null;
    if (socialType === SocialTypes.GOOGLE) {
      auth = await verifyGoogleLogin(socialToken);
    } else if (socialType === SocialTypes.APPLE) {
      auth = await verifyAppleLogin(socialToken);
    } else {
      throw "Invalid Social Type";
    }

    req.body.auth = auth;
    next();
  } catch (err: any) {
    return res.status(401).send({
      status: false,
      message: err?.message ?? "Invalid Token",
    });
  }
};

const verifyGoogleLogin = async (socialToken: string) => {
  const client = new OAuth2Client(env.oauth.google.clientId);
  const ticket = await client.verifyIdToken({
    idToken: socialToken,
    audience: env.oauth.google.clientId,
  });

  const payload = ticket.getPayload();

  if (typeof payload === "undefined") {
    throw "Invalid Token";
  }

  return payload;
};

const verifyAppleLogin = async (socialToken: string) => {
  const json = jwt.decode(socialToken, { complete: true });
  const kid = json?.header?.kid;
  if (!kid) {
    throw "Invalid Token";
  }

  const client = new JwksClient({
    jwksUri: `https://appleid.apple.com/auth/keys`,
  });

  const appleKey = await (await client.getSigningKey(kid)).getPublicKey();
  if (!appleKey) {
    throw "Invalid Token";
  }

  const payload = jwt.verify(socialToken, appleKey);

  if (!payload) {
    throw "Invalid Token";
  }
  return payload;
};
