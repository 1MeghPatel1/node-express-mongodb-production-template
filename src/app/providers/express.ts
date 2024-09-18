import express, { Application, Request } from "express";
import "express-async-errors";
import helmet from "helmet";
import compression from "compression";
import apiRouter from "../../routes/api/api";
import webRouter from "../../routes/web/web";
import { env } from "../../env";
import rateLimit from "express-rate-limit";
import bodyParser from "body-parser";
import useragent from "express-useragent";
import {
  ExceptionHandler,
  NotFoundHandler,
} from "../http/middleware/ExceptionHandler";
import cors from "cors";

export class Express {
  app: Application;

  constructor() {
    this.app = express();
  }

  initializeApp = () => {
    const port = process.env.APP_PORT;
    this.app.use(
      cors({
        origin: env.cors.urls,
        methods: ["GET", "HEAD", "OPTIONS", "POST", "PUT", "DELETE"],
      })
    );
    this.app.use(express.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(express.static(env.app.root_dir + "/public"));
    this.app.use(
      env.app.user_uploaded_content_path,
      express.static(env.app.root_dir + "/storage/uploads/")
    );
    this.app.use(helmet());
    this.app.use(compression());
    // Middleware to parse User-Agent
    this.app.use(useragent.express());
    this.app.disable("x-powered-by");

    // error handler
    this.app.set("port", port);
  };

  configureViews = (serverAdapter: any) => {
    this.app.set("view engine", "hbs");
    this.app.set("views", env.app.root_dir + "/views/");
    if (!env.app.api_only) {
      this.app.use("/", webRouter);
    }
    this.app.use(`/${env.app.api_prefix}`, apiRouter);
    this.app.use("/queues", serverAdapter.getRouter());
  };

  configureLocale = (middleware: any, i18next: any) => {
    this.app.use(middleware.handle(i18next));
  };

  configureRateLimiter = async () => {
    if (env.app.api_rate_limit > 0) {
      this.app.use(
        rateLimit({
          // Rate limiter configuration
          skip: (request: Request) => {
            const urlArray = request.originalUrl.split("/");
            if (
              urlArray.length > 2 &&
              urlArray[1] === "queues" &&
              urlArray[2] === "api"
            ) {
              return true;
            }
            return false;
          },
          windowMs: 15 * 60 * 1000, // 15 minutes
          max: env.app.api_rate_limit, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
          standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
          legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        })
      );
    }
  };

  configureExceptionHandler = () => {
    this.app.use(NotFoundHandler);
    this.app.use(ExceptionHandler);
  };
}
