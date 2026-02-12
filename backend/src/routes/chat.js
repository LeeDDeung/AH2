import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateChatPayload } from "../services/chatValidation.js";

function createChatRouter({ chatService }) {
  const router = Router();

  router.post(
    "/",
    asyncHandler(async (req, res) => {
      const payload = validateChatPayload(req.body);
      const result = await chatService.reply(payload);
      res.status(200).json(result);
    })
  );

  return router;
}

export { createChatRouter };
