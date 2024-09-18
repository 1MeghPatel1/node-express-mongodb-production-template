import { AppleDetail, SocialTypes, User } from "@prisma/client";
import dbConnection from "../providers/db";

export class SocialService {
  public static async getAppleDetails(
    socialId: string
  ): Promise<AppleDetail | null> {
    return await dbConnection.appleDetail.findFirst({
      where: {
        socialId: socialId,
      },
    });
  }

  public static async createAppleDetails(
    firstName: string,
    lastName: string,
    email: string,
    socialId: string
  ): Promise<AppleDetail> {
    return await dbConnection.appleDetail.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        socialId: socialId,
      },
    });
  }
  public static async socialLogin(
    socialId: string,
    socialType: SocialTypes,
    email: string,
    firstName: string,
    lastName: string
  ): Promise<User> {
    let user = await dbConnection.user.findFirst({
      where: {
        OR: [
          {
            socialId: socialId,
            socialType: socialType,
          },
          {
            email: email,
          },
        ],
      },
    });

    if (user) {
      await dbConnection.user.update({
        where: {
          id: user.id,
        },
        data: {
          firstName: firstName,
          lastName: lastName,
          password: null,
          forgotPasswordToken: null,
        },
      });
    } else {
      user = await dbConnection.user.create({
        data: {
          firstName: firstName,
          lastName: lastName,
          socialId: socialId,
          socialType: socialType,
          email: email,
        },
      });
    }

    return user;
  }
}
