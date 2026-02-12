import { UnprocessableEntityError } from "../utils/errors.js";
import { sanitizeText } from "../utils/sanitize.js";

const ALLOWED_SENDERS = new Set(["user", "ai"]);

function validateChatPayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new UnprocessableEntityError("Request body must be a JSON object.");
  }

  const message = sanitizeText(payload.message, 1_000);
  if (!message) {
    throw new UnprocessableEntityError("message is required.", {
      details: { field: "message" },
    });
  }

  const historyInput = payload.history ?? [];
  if (!Array.isArray(historyInput)) {
    throw new UnprocessableEntityError("history must be an array.", {
      details: { field: "history" },
    });
  }
  if (historyInput.length > 12) {
    throw new UnprocessableEntityError("history can contain at most 12 items.", {
      details: { field: "history" },
    });
  }

  const history = historyInput.map((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new UnprocessableEntityError("history items must be objects.", {
        details: { field: `history[${index}]` },
      });
    }
    const sender = String(item.sender ?? "").trim();
    if (!ALLOWED_SENDERS.has(sender)) {
      throw new UnprocessableEntityError("history sender is invalid.", {
        details: { field: `history[${index}].sender`, allowed: [...ALLOWED_SENDERS] },
      });
    }
    const text = sanitizeText(item.text, 600);
    if (!text) {
      throw new UnprocessableEntityError("history text is required.", {
        details: { field: `history[${index}].text` },
      });
    }
    return { sender, text };
  });

  return { message, history };
}

export { validateChatPayload };
