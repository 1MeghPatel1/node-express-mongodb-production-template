import { NextFunction, Request, Response } from "express";
import { Details } from "express-useragent";
import geoip from "geoip-lite";

export const getMetadata = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get IP address
    let ipAddress = req.headers["x-forwarded-for"] as string | string[]; // Type assertion for safety
    if (Array.isArray(ipAddress)) {
      ipAddress = ipAddress[0]; // Use the first IP in the array
    }
    ipAddress = ipAddress || req.ip || "Unknown IP";

    // Get User-Agent information
    const {
      browser,
      os,
      isMobile,
      isAndroid,
      isDesktop,
      isiPhone,
      isiPad,
      isWindows,
      isLinux,
      isLinux64,
      isMac,
      source,
      version,
      isBot,
    } = req.useragent as Details;

    const agent = {
      browser,
      os,
      isMobile,
      isAndroid,
      isDesktop,
      isiPhone,
      isiPad,
      isWindows,
      isLinux,
      isLinux64,
      isMac,
      source,
      version,
      isBot,
    };

    // Get location from IP address
    const geo = ipAddress && geoip.lookup(ipAddress);
    const location =
      geo && geo.city ? `${geo.city}, ${geo.country}` : "Unknown";

    // Attach metadata to the request object
    req.body.metaData = {
      agent,
      location,
    };

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    next(error);
  }
};
