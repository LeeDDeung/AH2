import { UnprocessableEntityError } from "../utils/errors.js";
import { clampNumber } from "../utils/sanitize.js";

const AGE_GROUP_TO_AGE = Object.freeze({
  AGE_18_34: 30,
  AGE_35_37: 36,
  AGE_38_39: 38,
  AGE_40_42: 41,
  AGE_43_44: 44,
  AGE_45_50: 47,
  UNKNOWN: 36,
});

function parseCount(value) {
  if (value === "6+") {
    return 6;
  }
  const parsed = Number.parseInt(String(value ?? "0"), 10);
  return Number.isFinite(parsed) ? clampNumber(parsed, 0, 20) : 0;
}

function toBoolean(value) {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "number") {
    return value > 0;
  }
  if (typeof value === "string") {
    return ["1", "true", "yes", "y"].includes(value.trim().toLowerCase());
  }
  return false;
}

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeUnifiedPredictionPayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new UnprocessableEntityError("Prediction request must be a JSON object.");
  }

  const basic = payload.basic ?? {};
  const procedure = payload.procedure ?? {};
  const causes = payload.causes ?? {};
  const history = payload.history ?? {};
  const embryo = payload.embryo ?? {};

  const ageGroup = String(basic.ageGroup ?? "UNKNOWN").trim().toUpperCase();
  const age = AGE_GROUP_TO_AGE[ageGroup] ?? AGE_GROUP_TO_AGE.UNKNOWN;
  const procedureTypeRaw = String(procedure.procedureType ?? "IVF").trim().toUpperCase();
  const procedureType = procedureTypeRaw === "DI" ? "DI" : "IVF";

  const infertilityReason = [];
  if (toBoolean(causes.maleFactor) || toBoolean(causes.maleFactorMain) || toBoolean(causes.maleFactorSub)) {
    infertilityReason.push("maleFactor");
  }
  if (toBoolean(causes.tubalDisease)) {
    infertilityReason.push("tubalDisease");
  }
  if (toBoolean(causes.ovulatoryDisorder)) {
    infertilityReason.push("ovulatoryDisorder");
  }
  if (toBoolean(causes.endometriosis)) {
    infertilityReason.push("endometriosis");
  }
  if (toBoolean(causes.unknownFactor)) {
    infertilityReason.push("unexplained");
  }

  const historyAttempts = parseCount(history.totalProcedures);
  const embryoCount = clampNumber(
    Math.max(
      toNumber(embryo.totalEmbryosCreated, 0),
      toNumber(embryo.embryosTransferred, 0),
      toNumber(embryo.embryosThawed, 0)
    ),
    0,
    40
  );

  return {
    age,
    procedureType,
    infertilityReason,
    historyAttempts,
    embryoCount,
    stimulationUsed: toBoolean(procedure.isOvulationStimulated),
  };
}

function toFrontendPredictionResponse(rawPrediction) {
  const probability = clampNumber(rawPrediction.calibratedProbability ?? rawPrediction.probability / 100, 0, 1);
  return {
    probability,
    ci_low: rawPrediction.confidenceInterval?.low ?? null,
    ci_high: rawPrediction.confidenceInterval?.high ?? null,
    cohort_mean: rawPrediction.cohortMean ?? null,
    cohort_percentile: rawPrediction.cohortPercentile ?? null,
    top_factors: rawPrediction.topFactors ?? null,
    notes: rawPrediction.message ?? null,
  };
}

function buildDistributionResponse(rawPrediction) {
  const probability = clampNumber(rawPrediction.calibratedProbability ?? rawPrediction.probability / 100, 0, 1);
  const ciLow = rawPrediction.confidenceInterval?.low ?? Math.max(0.01, probability - 0.1);
  const ciHigh = rawPrediction.confidenceInterval?.high ?? Math.min(0.99, probability + 0.1);
  const sigma = clampNumber((ciHigh - ciLow) / 3.92, 0.04, 0.18);

  const bins = 50;
  const distribution = [];
  let maxDensity = 0;
  for (let i = 0; i < bins; i += 1) {
    const x = i / (bins - 1);
    const density = Math.exp(-0.5 * Math.pow((x - probability) / sigma, 2));
    distribution.push(density);
    maxDensity = Math.max(maxDensity, density);
  }

  const normalizedDistribution = distribution.map((value) => Number((value / maxDensity).toFixed(4)));

  const z = {
    p10: -1.2816,
    p25: -0.6745,
    p50: 0,
    p75: 0.6745,
    p90: 1.2816,
  };

  const percentile = (zScore) => Number(clampNumber(probability + sigma * zScore, 0.01, 0.99).toFixed(4));

  return {
    probability: Number(probability.toFixed(4)),
    distribution: normalizedDistribution,
    percentiles: {
      p10: percentile(z.p10),
      p25: percentile(z.p25),
      p50: percentile(z.p50),
      p75: percentile(z.p75),
      p90: percentile(z.p90),
    },
    notes: "Estimated cohort distribution derived from the data-driven prediction model.",
  };
}

function buildPlannerResponse(rawPrediction) {
  const probability = clampNumber(rawPrediction.calibratedProbability ?? rawPrediction.probability / 100, 0, 1);

  let riskBand = "MEDIUM";
  if (probability >= 0.6) {
    riskBand = "LOW";
  } else if (probability < 0.35) {
    riskBand = "HIGH";
  }

  const planByRisk = {
    LOW: [
      {
        name: "Balanced IVF Care",
        monthly_range: [110000, 170000],
        why: "Current profile shows relatively favorable probability and supports a balanced plan.",
      },
      {
        name: "Stability Plus",
        monthly_range: [180000, 260000],
        why: "Adds broader outpatient and medication protection with predictable monthly costs.",
      },
    ],
    MEDIUM: [
      {
        name: "Comprehensive Cycle Plan",
        monthly_range: [180000, 280000],
        why: "Designed for moderate risk with broader cycle and follow-up coverage.",
      },
      {
        name: "Supportive Care Premium",
        monthly_range: [250000, 360000],
        why: "Includes stronger support for repeat attempts and related fertility procedures.",
      },
    ],
    HIGH: [
      {
        name: "High-Risk Intensive Cover",
        monthly_range: [290000, 430000],
        why: "Prioritizes repeated treatment support and high-cost scenario buffering.",
      },
      {
        name: "Advanced Continuity Plan",
        monthly_range: [340000, 520000],
        why: "Adds extended continuity options for prolonged treatment trajectories.",
      },
    ],
  };

  return {
    risk_band: riskBand,
    recommended_plans: planByRisk[riskBand],
    exclusions: [
      "Non-medical gender selection procedures",
      "Experimental interventions outside policy scope",
      "Procedures not prescribed by licensed specialists",
    ],
    notes: rawPrediction.message ?? "Planner recommendation is generated from model probability and risk band.",
  };
}

export {
  normalizeUnifiedPredictionPayload,
  toFrontendPredictionResponse,
  buildDistributionResponse,
  buildPlannerResponse,
};
