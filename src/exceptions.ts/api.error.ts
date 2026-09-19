export default class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors: unknown[];

  constructor(statusCode: number, message: string, errors: unknown[] = []) {
    super(message);

    this.statusCode = statusCode;
    this.errors = errors;
    this.name = "ApiError";

    Object.setPrototypeOf(this, ApiError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static BadRequest(message: string, errors: unknown[] = []): ApiError {
    return new ApiError(400, message, errors);
  }

  static UnauthorizedError(message = "User is not authorized."): ApiError {
    return new ApiError(401, message);
  }

  static Forbidden(message = "Access denied"): ApiError {
    return new ApiError(403, message);
  }

  static NotFound(message = "Resource not found"): ApiError {
    return new ApiError(404, message);
  }

  static Internal(message = "Internal server error"): ApiError {
    return new ApiError(500, message);
  }
}
