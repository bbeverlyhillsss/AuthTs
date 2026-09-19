import { Request, Response, NextFunction } from "express";
import ApiError from "../exceptions.ts/api.error.js";
import { validateAccessToken } from "../services/token.service.js";

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError());
    }

    const accessToken = authorizationHeader.split(" ")[1];
    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }

    const userData = validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }

    req.user = userData;
    return next();
  } catch {
    return next(ApiError.UnauthorizedError());
  }
}
