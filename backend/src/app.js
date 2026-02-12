import express from "express";
import { env } from "./config/env.js";
import { requestId } from "./middleware/requestId.js";
import { securityHeaders } from "./middleware/securityHeaders.js";
import { cors } from "./middleware/cors.js";
import { requireJson } from "./middleware/requireJson.js";
import { createRateLimiter } from "./middleware/rateLimiter.js";
import { createApiKeyAuth } from "./middleware/apiKeyAuth.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { requestLogger } from "./utils/logger.js";
import { createHealthRouter } from "./routes/health.js";
import { createPredictionsRouter } from "./routes/predictions.js";
import { createChatRouter } from "./routes/chat.js";
import { createUnifiedApiRouter } from "./routes/unifiedApi.js";

function createApp({ predictionService, chatService }) {
  const app = express();

  if (env.trustProxy) {
    app.set("trust proxy", 1);
  }

  app.disable("x-powered-by");

  app.use(requestId);
  app.use(securityHeaders);
  app.use(cors(env.corsAllowedOrigins));
  app.use(requestLogger(env.logSalt));
  app.use(requireJson);
  app.use(
    express.json({
      limit: env.maxBodySize,
      strict: true,
    })
  );

  const globalLimiter = createRateLimiter(env.globalRateLimit);
  const predictionLimiter = createRateLimiter(env.predictionRateLimit);
  const chatLimiter = createRateLimiter(env.chatRateLimit);
  const apiKeyAuth = createApiKeyAuth({
    enabled: env.requireApiKey,
    apiKey: env.apiKey,
  });

  app.use("/health", createHealthRouter({ predictionService, chatService }));

  app.use("/api", globalLimiter);
  app.use("/api", apiKeyAuth);
  app.use("/api/predict", predictionLimiter);
  app.use("/api/distribution", predictionLimiter);
  app.use("/api/planner", predictionLimiter);
  app.use("/api/chat", chatLimiter);
  app.use("/api", createUnifiedApiRouter({ predictionService, chatService }));
  app.use("/api/v1/predictions", apiKeyAuth, predictionLimiter, createPredictionsRouter({ predictionService }));
  app.use("/api/v1/chat", apiKeyAuth, chatLimiter, createChatRouter({ chatService }));

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

export { createApp };
