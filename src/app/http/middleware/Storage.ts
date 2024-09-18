import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { UPLOAD_TYPES } from "../../../utils/types";
import { STORAGE_PATH, validFileTypes } from "../../../utils/utils";

export const UploadSingleFile =
  (type: UPLOAD_TYPES, name: string) =>
  async (req: Request, res: Response, next: NextFunction) => {
    configuredMulter(type).single(name)(req, res, (error) => {
      if (error) {
        return res.send({
          status: false,
          message:
            error?.message || "Something went wrong while uploading asset",
        });
      }

      next();
    });
  };

/**
 * a configured multer instance
 * @param type
 * @returns
 */
const configuredMulter = (type: UPLOAD_TYPES) => {
  return multer({
    dest: STORAGE_PATH,
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
    fileFilter: function (req, file, cb) {
      const availableTypes = validFileTypes(type);

      if (!availableTypes.includes(file.mimetype)) {
        //if the file type does not match the allowed types, then return false
        cb(
          new Error(
            `Invalid file type.Please upload any of these types : ${availableTypes.concat()}`
          )
        );
      }
      cb(null, true);
    },
  });
};
