import { UnsupportedMediaTypeError } from "../utils/errors.js";

function requireJson(req, _res, next) {
  if (!["POST", "PUT", "PATCH"].includes(req.method)) {
    return next();
  }

  const contentType = req.headers["content-type"] ?? "";
  if (!String(contentType).toLowerCase().startsWith("application/json")) {
    return next(
      new UnsupportedMediaTypeError("Requests must use application/json", {
        code: "JSON_REQUIRED",
      })
    );
  }

  next();
}

export { requireJson };
