import crypto from "node:crypto";
import { UnauthorizedError } from "../utils/errors.js";

function timingSafeCompare(expected, actual) {
  const expectedBuffer = Buffer.from(expected, "utf8");
  const actualBuffer = Buffer.from(actual, "utf8");

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}

function createApiKeyAuth({ enabled, apiKey }) {
  return (req, _res, next) => {
    if (!enabled) {
      return next();
    }

    const supplied = req.get("x-api-key");
    if (!supplied || !timingSafeCompare(apiKey, supplied)) {
      return next(new UnauthorizedError("Invalid API key", { code: "INVALID_API_KEY" }));
    }

    next();
  };
}

export { createApiKeyAuth };
