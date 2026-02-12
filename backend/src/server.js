import { env } from "./config/env.js";
import { createApp } from "./app.js";
import { PredictionService } from "./services/predictionService.js";
import { ChatService } from "./services/chatService.js";
import { info, warn, error as logError } from "./utils/logger.js";

async function bootstrap() {
  info("startup.begin", {
    nodeEnv: env.nodeEnv,
    trainDataPath: env.trainDataPath,
    requireApiKey: env.requireApiKey,
  });

  if (env.weakLogSalt) {
    warn("startup.weak_log_salt", {
      message: "LOG_SALT is using a default/weak value.",
    });
  }

  const predictionService = new PredictionService({ trainDataPath: env.trainDataPath });
  await predictionService.init();

  const chatService = new ChatService({
    apiKey: env.openAiApiKey,
    model: env.openAiModel,
    timeoutMs: env.openAiTimeoutMs,
    maxOutputTokens: env.openAiMaxOutputTokens,
  });

  if (!chatService.health().enabled) {
    warn("startup.chat_disabled", {
      message: "OPENAI_API_KEY is missing. /api/v1/chat will return 503.",
    });
  }

  const app = createApp({ predictionService, chatService });
  const server = app.listen(env.port, () => {
    info("startup.ready", {
      port: env.port,
      openAiModel: env.openAiModel,
      predictionRows: predictionService.health().rows,
    });
  });

  server.requestTimeout = env.requestTimeoutMs;
  server.headersTimeout = env.requestTimeoutMs + 2_000;
  server.keepAliveTimeout = 5_000;

  function shutdown(signal) {
    info("shutdown.start", { signal });
    server.close((closeError) => {
      if (closeError) {
        logError("shutdown.error", { signal, error: closeError.message });
        process.exit(1);
      }
      info("shutdown.complete", { signal });
      process.exit(0);
    });
  }

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

bootstrap().catch((bootstrapError) => {
  logError("startup.failed", {
    error: bootstrapError?.message,
    stack: bootstrapError?.stack,
  });
  process.exit(1);
});
