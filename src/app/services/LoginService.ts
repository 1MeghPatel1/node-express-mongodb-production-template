import dbConnection from "../providers/db";
import bcrypt from "bcryptjs";
import { User } from "@prisma/client";

export class LoginService {
  /**
   *
   * @param email
   * @param password
   * @returns user
   */
  public static async login(
    email: string,
    password: string
  ): Promise<User | null> {
    const user = await dbConnection.user.findFirst({
      where: {
        email: email,
      },
    });

    if (user && user.password) {
      const isValid = bcrypt.compareSync(password, user.password);
      if (isValid) {
        return user;
      }
    }
    return null;
  }

  /**
   *
   * @param id User id
   * @returns profile of a user
   */
  public static async profile(id: string): Promise<User | null> {
    return await dbConnection.user.findFirst({
      where: {
        id: id,
      },
    });
  }
}
