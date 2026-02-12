import { Router } from "express";

function createHealthRouter({ predictionService, chatService }) {
  const router = Router();

  router.get("/", (_req, res) => {
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      services: {
        prediction: predictionService.health(),
        chat: chatService.health(),
      },
    });
  });

  return router;
}

export { createHealthRouter };
