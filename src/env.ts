import * as dotenv from "dotenv";
import { getOsEnv, normalizePort, toBool, toNumber } from "./libs/env";
dotenv.config();

/**
 * Environment variables
 */
export const env = {
  node: getOsEnv("APP_ENV"),
  app: {
    name: getOsEnv("APP_NAME"),
    host: getOsEnv("APP_URL"),
    debug:
      getOsEnv("APP_ENV") !== "production"
        ? toBool(getOsEnv("APP_DEBUG"))
        : false,
    port: normalizePort(process.env.PORT || getOsEnv("APP_PORT")),
    api_only: toBool(getOsEnv("API_ONLY")),
    api_prefix: getOsEnv("API_PREFIX"),
    pagination_limit: toNumber(getOsEnv("PAGINATION_LIMIT")),
    api_rate_limit: toNumber(getOsEnv("API_RATE_LIMIT")),
    root_dir: getOsEnv("APP_ENV") === "production" ? "dist" : "src",
    user_uploaded_content_path: getOsEnv("USER_UPLOADED_CONTENT_PATH"),
  },
  auth: {
    secret: getOsEnv("JWT_SECRET"),
    expiresIn: getOsEnv("JWT_EXPIRES_IN"),
    forgotPasswordExpiredIn: getOsEnv("JWT_FORGOT_PASSWORD_EXPIRES_IN"),
    verificationExpiresIn: getOsEnv("JWT_VERIFICATION_EXPIRES_IN"),
  },
  redis: {
    url:
      getOsEnv("REDIS_USERNAME") || getOsEnv("REDIS_PASSWORD")
        ? `redis://${getOsEnv("REDIS_USERNAME")}:${getOsEnv(
            "REDIS_PASSWORD"
          )}@${getOsEnv("REDIS_HOST")}:${getOsEnv("REDIS_PORT")}`
        : `redis://${getOsEnv("REDIS_HOST")}:${getOsEnv("REDIS_PORT")}`,
    host: getOsEnv("REDIS_HOST"),
    port: getOsEnv("REDIS_PORT"),
    password: getOsEnv("REDIS_PASSWORD"),
    username: getOsEnv("REDIS_USERNAME"),
  },
  aws: {
    accessKey: getOsEnv("AWS_ACCESS_KEY_ID"),
    secretAccessKey: getOsEnv("AWS_SECRET_ACCESS_KEY"),
    bucket: getOsEnv("AWS_BUCKET"),
    region: getOsEnv("AWS_DEFAULT_REGION"),
  },
  mail: {
    host: getOsEnv("MAIL_HOST"),
    port: toNumber(getOsEnv("MAIL_PORT")),
    username: getOsEnv("MAIL_USERNAME"),
    password: getOsEnv("MAIL_PASSWORD"),
    enc: getOsEnv("MAIL_ENCRYPTION"),
    from_address: getOsEnv("MAIL_FROM_ADDRESS"),
    name: getOsEnv("MAIL_FROM_NAME"),
  },
  oauth: {
    google: {
      clientId: getOsEnv("GOOGLE_CLIENT_ID"),
    },
    apple: {
      clientId: getOsEnv("APPLE_CLIENT_ID"),
    },
  },
  cors: {
    urls: getOsEnv("CORS_AVAILABLE_LINKS").split(","),
  },
};
