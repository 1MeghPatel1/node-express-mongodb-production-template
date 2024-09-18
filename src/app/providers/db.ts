import { PrismaClient } from "@prisma/client";
import { logger } from "./logger";

const dbConnection = new PrismaClient();

dbConnection.$use(async (params, next) => {
  // Check incoming query type
  if (params.model == "Device") {
    if (params.action == "delete") {
      // Delete queries
      // Change action to an update
      params.action = "update";
      params.args["data"] = { fcmToken: null };
      params.args["data"] = { deletedAt: new Date() };
    }
    if (params.action == "deleteMany") {
      // Delete many queries
      params.action = "updateMany";
      params.args["data"] = { fcmToken: null };
      params.args["data"] = { deletedAt: new Date() };
    }
  }
  return next(params);
});

dbConnection.$use(async (params, next) => {
  const before = Date.now();

  const result = await next(params);

  const after = Date.now();

  logger.info(
    `Query ${params.model}.${params.action} took ${after - before}ms
    Query params : ${JSON.stringify(params.args)}
    `
  );

  return result;
});

export default dbConnection;
