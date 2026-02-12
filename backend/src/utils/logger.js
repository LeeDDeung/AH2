import crypto from "node:crypto";

function nowIso() {
  return new Date().toISOString();
}

function write(level, message, meta = {}) {
  const payload = {
    time: nowIso(),
    level,
    message,
    ...meta,
  };
  process.stdout.write(`${JSON.stringify(payload)}\n`);
}

function info(message, meta = {}) {
  write("info", message, meta);
}

function warn(message, meta = {}) {
  write("warn", message, meta);
}

function error(message, meta = {}) {
  write("error", message, meta);
}

function hashIp(ip, salt) {
  const source = String(ip ?? "unknown");
  return crypto.createHmac("sha256", salt).update(source).digest("hex").slice(0, 16);
}

function requestLogger(logSalt) {
  return (req, res, next) => {
    const startedAt = process.hrtime.bigint();
    const ip = req.ip || req.socket?.remoteAddress || "unknown";
    const ipHash = hashIp(ip, logSalt);
    res.on("finish", () => {
      const elapsedNs = process.hrtime.bigint() - startedAt;
      const durationMs = Number(elapsedNs / BigInt(1_000_000));
      info("request.complete", {
        requestId: req.requestId,
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs,
        ipHash,
      });
    });
    next();
  };
}

export { info, warn, error, requestLogger };
