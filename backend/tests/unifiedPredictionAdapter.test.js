import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeUnifiedPredictionPayload,
  toFrontendPredictionResponse,
  buildDistributionResponse,
  buildPlannerResponse,
} from "../src/services/unifiedPredictionAdapter.js";

test("normalizeUnifiedPredictionPayload maps frontend schema to backend payload", () => {
  const normalized = normalizeUnifiedPredictionPayload({
    basic: { ageGroup: "AGE_35_37" },
    procedure: { procedureType: "IVF", isOvulationStimulated: true },
    causes: { maleFactor: true, unknownFactor: true },
    history: { totalProcedures: "6+" },
    embryo: { totalEmbryosCreated: 4 },
  });

  assert.equal(normalized.age, 36);
  assert.equal(normalized.procedureType, "IVF");
  assert.equal(normalized.stimulationUsed, true);
  assert.equal(normalized.historyAttempts, 6);
  assert.equal(normalized.embryoCount, 4);
  assert.deepEqual(normalized.infertilityReason, ["maleFactor", "unexplained"]);
});

test("adapter builds frontend-ready prediction/distribution/planner responses", () => {
  const raw = {
    probability: 42,
    calibratedProbability: 0.4211,
    confidenceInterval: { low: 0.31, high: 0.53, effectiveSampleSize: 120 },
    cohortMean: 0.39,
    cohortPercentile: 63,
    topFactors: [{ name: "Age Group", direction: "down", strength: 0.8 }],
    message: "sample",
  };

  const prediction = toFrontendPredictionResponse(raw);
  assert.equal(prediction.probability, 0.4211);
  assert.equal(prediction.ci_low, 0.31);
  assert.equal(prediction.ci_high, 0.53);
  assert.equal(prediction.cohort_percentile, 63);

  const distribution = buildDistributionResponse(raw);
  assert.equal(distribution.distribution.length, 50);
  assert.equal(distribution.probability > 0 && distribution.probability < 1, true);
  assert.equal(distribution.percentiles.p50 > 0, true);

  const planner = buildPlannerResponse(raw);
  assert.equal(["LOW", "MEDIUM", "HIGH"].includes(planner.risk_band), true);
  assert.equal(planner.recommended_plans.length > 0, true);
});
