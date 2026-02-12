import { ForbiddenError } from "../utils/errors.js";

function cors(allowedOrigins) {
  return (req, res, next) => {
    const origin = req.headers.origin;

    if (!origin) {
      if (req.method === "OPTIONS") {
        return res.status(204).end();
      }
      return next();
    }

    if (!allowedOrigins.has(origin)) {
      return next(
        new ForbiddenError("Origin is not allowed", {
          code: "CORS_ORIGIN_DENIED",
        })
      );
    }

    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-API-Key, X-Request-Id");
    res.setHeader("Access-Control-Max-Age", "600");

    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }

    next();
  };
}

export { cors };
