import path from "node:path";
import { fileURLToPath } from "node:url";

function parseBoolean(value, fallback = false) {
  if (value == null || value === "") {
    return fallback;
  }
  const normalized = String(value).trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalized)) {
    return true;
  }
  if (["0", "false", "no", "off"].includes(normalized)) {
    return false;
  }
  return fallback;
}

function parseInteger(value, fallback) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseOrigins(value) {
  const raw = String(value ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
  return new Set(raw);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, "../..");
const defaultTrainPath = path.resolve(backendRoot, "..", "DATA", "train.csv");

const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: parseInteger(process.env.PORT, 8080),
  trustProxy: parseBoolean(process.env.TRUST_PROXY, false),
  corsAllowedOrigins: parseOrigins(process.env.CORS_ALLOW_ORIGINS ?? "http://localhost:5173"),
  requireApiKey: parseBoolean(process.env.REQUIRE_API_KEY, true),
  apiKey: process.env.API_KEY ?? "",
  maxBodySize: process.env.MAX_BODY_SIZE ?? "16kb",
  requestTimeoutMs: parseInteger(process.env.REQUEST_TIMEOUT_MS, 10_000),
  globalRateLimit: {
    max: parseInteger(process.env.GLOBAL_RATE_LIMIT_MAX, 120),
    windowMs: parseInteger(process.env.GLOBAL_RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
    name: "global",
  },
  predictionRateLimit: {
    max: parseInteger(process.env.PREDICT_RATE_LIMIT_MAX, 60),
    windowMs: parseInteger(process.env.PREDICT_RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
    name: "prediction",
  },
  chatRateLimit: {
    max: parseInteger(process.env.CHAT_RATE_LIMIT_MAX, 20),
    windowMs: parseInteger(process.env.CHAT_RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
    name: "chat",
  },
  openAiApiKey: process.env.OPENAI_API_KEY ?? "",
  openAiModel: process.env.OPENAI_MODEL ?? "gpt-5-mini",
  openAiTimeoutMs: parseInteger(process.env.OPENAI_TIMEOUT_MS, 12_000),
  openAiMaxOutputTokens: parseInteger(process.env.OPENAI_MAX_OUTPUT_TOKENS, 350),
  trainDataPath: path.resolve(backendRoot, process.env.TRAIN_DATA_PATH ?? "../DATA/train.csv"),
  logSalt: process.env.LOG_SALT ?? "replace-me",
};

if (env.requireApiKey && !env.apiKey) {
  throw new Error("REQUIRE_API_KEY=true but API_KEY is missing.");
}

if (!env.logSalt || env.logSalt === "replace-me") {
  // Non-fatal but explicitly warn in startup logs.
  env.weakLogSalt = true;
} else {
  env.weakLogSalt = false;
}

if (!process.env.TRAIN_DATA_PATH) {
  env.trainDataPath = defaultTrainPath;
}

export { env };
