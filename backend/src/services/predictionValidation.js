import { UnprocessableEntityError } from "../utils/errors.js";
import { coerceOptionalInteger } from "../utils/sanitize.js";

const ALLOWED_PROCEDURE_TYPES = new Set(["IVF", "IUI", "ICSI", "DI", "Unknown", "UNKNOWN"]);
const ALLOWED_REASONS = new Set([
  "maleFactor",
  "tubalDisease",
  "ovulatoryDisorder",
  "endometriosis",
  "unexplained",
]);

function validatePredictionPayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new UnprocessableEntityError("Request body must be a JSON object.");
  }

  const age = Number.parseInt(String(payload.age ?? ""), 10);
  if (!Number.isFinite(age) || age < 18 || age > 55) {
    throw new UnprocessableEntityError("age must be an integer between 18 and 55.", {
      details: { field: "age" },
    });
  }

  const procedureType = String(payload.procedureType ?? "").trim();
  if (!ALLOWED_PROCEDURE_TYPES.has(procedureType)) {
    throw new UnprocessableEntityError("procedureType is invalid.", {
      details: { field: "procedureType", allowed: [...ALLOWED_PROCEDURE_TYPES] },
    });
  }

  const historyAttempts = coerceOptionalInteger(payload.historyAttempts, 0);
  if (historyAttempts < 0 || historyAttempts > 20) {
    throw new UnprocessableEntityError("historyAttempts must be between 0 and 20.", {
      details: { field: "historyAttempts" },
    });
  }

  const embryoCount = coerceOptionalInteger(payload.embryoCount, 0);
  if (embryoCount < 0 || embryoCount > 40) {
    throw new UnprocessableEntityError("embryoCount must be between 0 and 40.", {
      details: { field: "embryoCount" },
    });
  }

  if (typeof payload.stimulationUsed !== "boolean") {
    throw new UnprocessableEntityError("stimulationUsed must be a boolean.", {
      details: { field: "stimulationUsed" },
    });
  }

  const reasonsRaw = payload.infertilityReason;
  if (!Array.isArray(reasonsRaw)) {
    throw new UnprocessableEntityError("infertilityReason must be an array.", {
      details: { field: "infertilityReason" },
    });
  }
  if (reasonsRaw.length > ALLOWED_REASONS.size) {
    throw new UnprocessableEntityError("Too many infertility reasons.", {
      details: { field: "infertilityReason" },
    });
  }

  const normalizedReasons = [];
  const seen = new Set();
  for (const value of reasonsRaw) {
    const reason = String(value ?? "").trim();
    if (!ALLOWED_REASONS.has(reason)) {
      throw new UnprocessableEntityError("infertilityReason contains invalid value.", {
        details: { field: "infertilityReason", invalid: reason, allowed: [...ALLOWED_REASONS] },
      });
    }
    if (!seen.has(reason)) {
      seen.add(reason);
      normalizedReasons.push(reason);
    }
  }

  return {
    age,
    procedureType,
    historyAttempts,
    embryoCount,
    stimulationUsed: payload.stimulationUsed,
    infertilityReason: normalizedReasons,
  };
}

export { validatePredictionPayload };
