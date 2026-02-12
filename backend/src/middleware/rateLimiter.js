import { TooManyRequestsError } from "../utils/errors.js";

function createRateLimiter({ windowMs, max, name }) {
  const buckets = new Map();

  function cleanup(now) {
    const cutoff = now - windowMs;
    for (const [key, timestamps] of buckets.entries()) {
      while (timestamps.length > 0 && timestamps[0] <= cutoff) {
        timestamps.shift();
      }
      if (timestamps.length === 0) {
        buckets.delete(key);
      }
    }
  }

  return (req, res, next) => {
    const now = Date.now();
    const cutoff = now - windowMs;
    const key = req.ip || req.socket?.remoteAddress || "unknown";
    const timestamps = buckets.get(key) ?? [];

    while (timestamps.length > 0 && timestamps[0] <= cutoff) {
      timestamps.shift();
    }

    if (timestamps.length >= max) {
      const retryAfterSeconds = Math.max(1, Math.ceil((timestamps[0] + windowMs - now) / 1000));
      res.setHeader("Retry-After", String(retryAfterSeconds));
      return next(
        new TooManyRequestsError("Rate limit exceeded", {
          code: "RATE_LIMIT_EXCEEDED",
          details: { bucket: name, retryAfterSeconds },
        })
      );
    }

    timestamps.push(now);
    buckets.set(key, timestamps);

    if (Math.random() < 0.01) {
      cleanup(now);
    }

    next();
  };
}

export { createRateLimiter };
