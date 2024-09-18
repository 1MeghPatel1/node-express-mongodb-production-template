import { NextFunction, Request, Response } from "express";
import { env } from "../../../env";
import { toNumber } from "../../../libs/env";

export const paginationCleaner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let page = req.query?.page || 1;
  let perPage = req.query?.per_page || env.app.pagination_limit;

  if (typeof page !== "string" && typeof page !== "number") {
    page = 1;
  }

  if (typeof perPage !== "string" && typeof perPage !== "number") {
    perPage = env.app.pagination_limit;
  }

  if (typeof page === "string") {
    page = toNumber(page);
  }

  if (typeof perPage === "string") {
    perPage = toNumber(perPage);
  }

  if (page <= 0) {
    page = 1;
  }

  if (perPage <= 0) {
    perPage = env.app.pagination_limit;
  }

  req.body.pagination = {
    page: page,
    perPage: perPage,
  };

  next();
};
