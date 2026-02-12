class AppError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = options.statusCode ?? 500;
    this.code = options.code ?? "INTERNAL_ERROR";
    this.details = options.details ?? undefined;
    this.isOperational = options.isOperational ?? true;
  }
}

class BadRequestError extends AppError {
  constructor(message = "Bad request", options = {}) {
    super(message, { ...options, statusCode: 400, code: options.code ?? "BAD_REQUEST" });
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", options = {}) {
    super(message, { ...options, statusCode: 401, code: options.code ?? "UNAUTHORIZED" });
  }
}

class ForbiddenError extends AppError {
  constructor(message = "Forbidden", options = {}) {
    super(message, { ...options, statusCode: 403, code: options.code ?? "FORBIDDEN" });
  }
}

class NotFoundError extends AppError {
  constructor(message = "Not found", options = {}) {
    super(message, { ...options, statusCode: 404, code: options.code ?? "NOT_FOUND" });
  }
}

class UnsupportedMediaTypeError extends AppError {
  constructor(message = "Unsupported media type", options = {}) {
    super(message, { ...options, statusCode: 415, code: options.code ?? "UNSUPPORTED_MEDIA_TYPE" });
  }
}

class TooManyRequestsError extends AppError {
  constructor(message = "Too many requests", options = {}) {
    super(message, { ...options, statusCode: 429, code: options.code ?? "RATE_LIMITED" });
  }
}

class UnprocessableEntityError extends AppError {
  constructor(message = "Validation failed", options = {}) {
    super(message, { ...options, statusCode: 422, code: options.code ?? "VALIDATION_ERROR" });
  }
}

class ServiceUnavailableError extends AppError {
  constructor(message = "Service unavailable", options = {}) {
    super(message, { ...options, statusCode: 503, code: options.code ?? "SERVICE_UNAVAILABLE" });
  }
}

export {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  UnsupportedMediaTypeError,
  TooManyRequestsError,
  UnprocessableEntityError,
  ServiceUnavailableError,
};
