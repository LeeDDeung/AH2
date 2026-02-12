import OpenAI from "openai";
import { ServiceUnavailableError } from "../utils/errors.js";
import { sanitizeText } from "../utils/sanitize.js";

const SYSTEM_PROMPT_BY_ROLE = {
  PATIENT: [
    "You are a supportive fertility-care assistant for patients.",
    "Respond in Korean when user text is Korean, otherwise in English.",
    "Offer emotional support and practical next steps.",
    "Never provide medical diagnosis, prescriptions, or emergency claims.",
    "Always suggest consulting a licensed specialist for definitive medical decisions.",
    "Keep answers concise and safe.",
  ].join(" "),
  DOCTOR: [
    "You are a clinical AI assistant for fertility specialists.",
    "Keep tone objective, concise, and data-oriented.",
    "Focus on interpretation support, risk framing, and communication clarity.",
    "Do not provide definitive diagnosis or treatment decisions.",
    "When uncertain, explicitly mark uncertainty and recommend specialist judgment.",
  ].join(" "),
  PLANNER: [
    "You are an insurance and care-planning assistant for fertility journeys.",
    "Use clear business-like tone and summarize risks and options.",
    "Do not provide legal guarantees or definitive medical decisions.",
    "Use cautious language and mention that final terms depend on policy and specialist review.",
  ].join(" "),
};

function extractChatContent(response) {
  const content = response?.choices?.[0]?.message?.content;
  if (typeof content === "string") {
    return content;
  }
  if (Array.isArray(content)) {
    const parts = content
      .map((item) => (typeof item?.text === "string" ? item.text : ""))
      .filter(Boolean);
    return parts.join("\n");
  }
  return "";
}

function timeoutPromise(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new ServiceUnavailableError("LLM timeout.", { code: "LLM_TIMEOUT" }));
    }, ms);
  });
}

class ChatService {
  constructor({ apiKey, model, timeoutMs, maxOutputTokens }) {
    this.enabled = Boolean(apiKey);
    this.model = model;
    this.timeoutMs = timeoutMs;
    this.maxOutputTokens = maxOutputTokens;
    this.client = this.enabled ? new OpenAI({ apiKey }) : null;
  }

  health() {
    return {
      enabled: this.enabled,
      model: this.model,
    };
  }

  async reply({ message, history = [], role = "PATIENT" }) {
    if (!this.enabled || !this.client) {
      throw new ServiceUnavailableError("Chat service is disabled. Configure OPENAI_API_KEY.", {
        code: "CHAT_DISABLED",
      });
    }

    const roleKey = String(role ?? "PATIENT").trim().toUpperCase();
    const systemPrompt = SYSTEM_PROMPT_BY_ROLE[roleKey] ?? SYSTEM_PROMPT_BY_ROLE.PATIENT;

    const messages = [
      {
        role: "system",
        content: systemPrompt,
      },
      ...history.map((item) => {
        const role = item.sender === "ai" ? "assistant" : "user";
        return {
          role,
          content: item.text,
        };
      }),
      {
        role: "user",
        content: message,
      },
    ];

    let response;
    try {
      response = await Promise.race([
        this.client.chat.completions.create({
          model: this.model,
          messages,
          max_completion_tokens: Math.max(this.maxOutputTokens, 1000),
        }),
        timeoutPromise(this.timeoutMs),
      ]);
    } catch (error) {
      if (error instanceof ServiceUnavailableError) {
        throw error;
      }
      throw new ServiceUnavailableError("LLM request failed.", {
        code: "LLM_REQUEST_FAILED",
      });
    }

    const outputText = sanitizeText(extractChatContent(response), 1_200);
    if (!outputText) {
      throw new ServiceUnavailableError("LLM returned an empty response.", {
        code: "LLM_EMPTY_RESPONSE",
      });
    }

    return {
      message: outputText,
      model: this.model,
    };
  }
}

export { ChatService };
