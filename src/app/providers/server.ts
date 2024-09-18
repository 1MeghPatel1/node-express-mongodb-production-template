import http from "http";
import { env } from "../../env";
import { Application } from "express";
import { Logger } from "pino";
import { logger } from "./logger";

export class Server {
  server: http.Server;
  logger: Logger;

  constructor(app: Application) {
    this.server = http.createServer(app);
    this.logger = logger;
  }

  /**
   *  runs the server
   */
  async start() {
    this.server.listen(env.app.port);
    this.logger.info("Server Listening on port:" + env.app.port + ` URL - ${env.app.host}${env.app.port}`);
    this.server.on("error", this.onError);
  }

  /**
   * Event listener for HTTP server "error" event.
   */

  async onError(error: any) {
    if (error.syscall !== "listen") {
      throw error;
    }

    var bind =
      typeof env.app.port === "string"
        ? "Pipe " + env.app.port
        : "Port " + env.app.port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case "EACCES":
        this.logger.fatal(bind + " requires elevated privileges");
        process.exit(1);
        break;
      case "EADDRINUSE":
        this.logger.fatal(bind + " is already in use");
        process.exit(1);
        break;
      default:
        throw error;
    }
  }
}
