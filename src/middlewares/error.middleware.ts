import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import ApiError from "../exceptions.ts/api.error.js";

interface MongoDuplicateKeyError extends Error {
  code: number;
}

const isMongoDuplicateKeyError = (
  error: unknown,
): error is MongoDuplicateKeyError => {
  return (
    error instanceof Error &&
    "code" in error &&
    (error as MongoDuplicateKeyError).code === 11000
  );
};

const errorMiddleware = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): Response => {
  console.log(error);

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      message: error.message,
      errors: error.errors,
    });
  }

  if (error instanceof mongoose.Error.CastError) {
    return res.status(404).json({ message: "Resource not found." });
  }

  if (isMongoDuplicateKeyError(error)) {
    return res.status(400).json({ message: "Duplicate field value entered." });
  }

  if (error instanceof mongoose.Error.ValidationError) {
    const message = Object.values(error.errors).map((val) => val.message);
    return res.status(400).json({ message: message.join(", ") });
  }

  return res.status(500).json({ message: "Server error." });
};

export default errorMiddleware;
