import { logger } from "./app/providers/logger";
import serverAdapter from "./app/providers/queues";
import { Locale } from "./app/providers/locale";
import { cron } from "./app/providers/cron";
import { Server } from "./app/providers/server";
import { Express } from "./app/providers/express";

const express = new Express();
const locale = new Locale();
const { middleware, i18next } = locale.initializeLocales();

Promise.all([
  express.initializeApp(),
  express.configureRateLimiter(),
  express.configureLocale(middleware, i18next),
  express.configureViews(serverAdapter),
  express.configureExceptionHandler(),
]).then(() => {
  const app = express.app;
  const httpServer = new Server(app);
  httpServer.start();
  cron.setup();
});

process.on("uncaughtException", (err) => {
  logger.error(err);
  process.exit(1);
});

process.on("SIGTERM", async () => {
  logger.debug("SIGTERM signal received: closing HTTP server");
  process.exit(1);
});

process.on("SIGINT", async () => {
  logger.debug("SIGINT signal received: closing HTTP server");
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  logger.error(err);
  process.exit(1);
});
