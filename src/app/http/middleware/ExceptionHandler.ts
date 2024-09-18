import { NextFunction, Request, Response } from "express";
import { logger } from "../../providers/logger";

/**
 * 404 api redirects
 */
export const NotFoundHandler = (req: Request, res: Response) => {
  logger.info(`Error 404:${req.method} ${req.originalUrl} - Not Found`);
  if (req.headers.accept === "application/json") {
    return res.status(404).json({
      status: false,
      message: "Not found",
    });
  }
  res.render("errors/404");
};

/**
 * 500 request error handler
 */
export const ExceptionHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`Error 500: ${err.stack}`);

  if (req.headers.accept === "application/json") {
    return res.status(500).send({
      status: false,
      message: "Something broke!",
    });
  }
  res.render("errors/500");
};
