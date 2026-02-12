import { NotFoundError } from "../utils/errors.js";

function notFound(req, _res, next) {
  next(
    new NotFoundError("Route not found", {
      code: "ROUTE_NOT_FOUND",
      details: { path: req.originalUrl, method: req.method },
    })
  );
}

export { notFound };
