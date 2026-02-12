import { UnprocessableEntityError } from "../utils/errors.js";
import { sanitizeText } from "../utils/sanitize.js";

const ALLOWED_ROLES = new Set(["PATIENT", "DOCTOR", "PLANNER"]);
const ALLOWED_MESSAGE_ROLES = new Set(["user", "assistant"]);

function validateUnifiedChatPayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new UnprocessableEntityError("Chat request must be a JSON object.");
  }

  const roleRaw = String(payload.role ?? "PATIENT").trim().toUpperCase();
  const role = ALLOWED_ROLES.has(roleRaw) ? roleRaw : "PATIENT";

  const messagesInput = payload.messages;
  if (!Array.isArray(messagesInput) || messagesInput.length === 0) {
    throw new UnprocessableEntityError("messages must be a non-empty array.", {
      details: { field: "messages" },
    });
  }

  if (messagesInput.length > 24) {
    throw new UnprocessableEntityError("messages can contain at most 24 items.", {
      details: { field: "messages" },
    });
  }

  const messages = messagesInput.map((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new UnprocessableEntityError("messages items must be objects.", {
        details: { field: `messages[${index}]` },
      });
    }
    const itemRole = String(item.role ?? "").trim();
    if (!ALLOWED_MESSAGE_ROLES.has(itemRole)) {
      throw new UnprocessableEntityError("messages role is invalid.", {
        details: { field: `messages[${index}].role` },
      });
    }
    const content = sanitizeText(item.content, 1_200);
    if (!content) {
      throw new UnprocessableEntityError("messages content is required.", {
        details: { field: `messages[${index}].content` },
      });
    }
    return { role: itemRole, content };
  });

  const latestUserIndex = [...messages]
    .map((entry, index) => ({ entry, index }))
    .reverse()
    .find((item) => item.entry.role === "user")?.index;

  if (!Number.isInteger(latestUserIndex)) {
    throw new UnprocessableEntityError("At least one user message is required.", {
      details: { field: "messages" },
    });
  }

  const historyStartIndex = Math.max(0, latestUserIndex - 12);
  const history = messages.slice(historyStartIndex, latestUserIndex).map((item) => ({
    sender: item.role === "assistant" ? "ai" : "user",
    text: item.content,
  }));

  return {
    role,
    message: messages[latestUserIndex].content,
    history,
  };
}

export { validateUnifiedChatPayload };
