import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validatePredictionPayload } from "../services/predictionValidation.js";

function createPredictionsRouter({ predictionService }) {
  const router = Router();

  router.post(
    "/",
    asyncHandler(async (req, res) => {
      const payload = validatePredictionPayload(req.body);
      const result = predictionService.predict(payload);
      res.status(200).json(result);
    })
  );

  return router;
}

export { createPredictionsRouter };
