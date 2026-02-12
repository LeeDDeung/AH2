import test from "node:test";
import assert from "node:assert/strict";
import { validateUnifiedChatPayload } from "../src/services/unifiedChatValidation.js";

test("validateUnifiedChatPayload extracts latest user message and history", () => {
  const payload = validateUnifiedChatPayload({
    role: "PATIENT",
    messages: [
      { role: "assistant", content: "안녕하세요." },
      { role: "user", content: "불안해요." },
      { role: "assistant", content: "괜찮아요." },
      { role: "user", content: "다음 단계가 궁금해요." },
    ],
  });

  assert.equal(payload.role, "PATIENT");
  assert.equal(payload.message, "다음 단계가 궁금해요.");
  assert.equal(payload.history.length, 3);
  assert.deepEqual(payload.history[0], { sender: "ai", text: "안녕하세요." });
});

test("validateUnifiedChatPayload rejects invalid payload", () => {
  assert.throws(
    () =>
      validateUnifiedChatPayload({
        role: "PATIENT",
        messages: [{ role: "assistant", content: "hello" }],
      }),
    /At least one user message is required/i
  );
});
