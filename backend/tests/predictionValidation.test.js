import test from "node:test";
import assert from "node:assert/strict";
import { validatePredictionPayload } from "../src/services/predictionValidation.js";

test("validatePredictionPayload accepts valid payload", () => {
  const payload = validatePredictionPayload({
    age: "32",
    procedureType: "IVF",
    infertilityReason: ["maleFactor", "unexplained"],
    historyAttempts: "1",
    embryoCount: "3",
    stimulationUsed: true,
  });

  assert.equal(payload.age, 32);
  assert.equal(payload.procedureType, "IVF");
  assert.deepEqual(payload.infertilityReason, ["maleFactor", "unexplained"]);
  assert.equal(payload.historyAttempts, 1);
  assert.equal(payload.embryoCount, 3);
  assert.equal(payload.stimulationUsed, true);
});

test("validatePredictionPayload rejects invalid procedureType", () => {
  assert.throws(
    () =>
      validatePredictionPayload({
        age: 32,
        procedureType: "XYZ",
        infertilityReason: [],
        historyAttempts: 0,
        embryoCount: 0,
        stimulationUsed: true,
      }),
    /procedureType is invalid/i
  );
});
