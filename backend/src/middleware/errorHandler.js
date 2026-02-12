import { AppError } from "../utils/errors.js";
import { error as logError } from "../utils/logger.js";

function errorHandler(err, req, res, _next) {
  const jsonSyntaxError =
    err instanceof SyntaxError && err.status === 400 && Object.prototype.hasOwnProperty.call(err, "body");

  const normalizedError = jsonSyntaxError
    ? new AppError("Invalid JSON payload.", { statusCode: 400, code: "INVALID_JSON" })
    : err;

  const known = normalizedError instanceof AppError;
  const statusCode = known ? normalizedError.statusCode : 500;
  const code = known ? normalizedError.code : "INTERNAL_ERROR";
  const publicMessage = statusCode >= 500 ? "Internal server error" : normalizedError.message;

  if (!known || statusCode >= 500) {
    logError("request.failed", {
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl,
      code,
      statusCode,
      stack: normalizedError?.stack,
    });
  }

  const payload = {
    error: {
      code,
      message: publicMessage,
      requestId: req.requestId,
    },
  };

  if (known && normalizedError.details && statusCode < 500) {
    payload.error.details = normalizedError.details;
  }

  res.status(statusCode).json(payload);
}

export { errorHandler };
