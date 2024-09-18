import { User } from "@prisma/client";

export const UserResponse = (data: User | User[]) => {
  if (Array.isArray(data)) {
    return data.map((d) => objectResponse(d));
  }

  return objectResponse(data);
};

const objectResponse = (user: User) => {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.firstName + " " + user.lastName,
    email: user.email,
    createdAt: user.createdAt,
  };
};
