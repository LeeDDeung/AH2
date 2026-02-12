import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  normalizeUnifiedPredictionPayload,
  toFrontendPredictionResponse,
  buildDistributionResponse,
  buildPlannerResponse,
} from "../services/unifiedPredictionAdapter.js";
import { validateUnifiedChatPayload } from "../services/unifiedChatValidation.js";

function createUnifiedApiRouter({ predictionService, chatService }) {
  const router = Router();

  router.post(
    "/predict",
    asyncHandler(async (req, res) => {
      const normalizedPayload = normalizeUnifiedPredictionPayload(req.body);
      const prediction = predictionService.predict(normalizedPayload);
      res.status(200).json(toFrontendPredictionResponse(prediction));
    })
  );

  router.post(
    "/distribution",
    asyncHandler(async (req, res) => {
      const normalizedPayload = normalizeUnifiedPredictionPayload(req.body);
      const prediction = predictionService.predict(normalizedPayload);
      res.status(200).json(buildDistributionResponse(prediction));
    })
  );

  router.post(
    "/planner",
    asyncHandler(async (req, res) => {
      const normalizedPayload = normalizeUnifiedPredictionPayload(req.body);
      const prediction = predictionService.predict(normalizedPayload);
      res.status(200).json(buildPlannerResponse(prediction));
    })
  );

  router.post(
    "/chat",
    asyncHandler(async (req, res) => {
      const payload = validateUnifiedChatPayload(req.body);
      const result = await chatService.reply(payload);
      res.status(200).json({
        message: result.message,
        model: result.model,
      });
    })
  );

  return router;
}

export { createUnifiedApiRouter };
