import fs from "node:fs";
import readline from "node:readline";
import { parseCsvLine, toBinary, toNumber } from "../utils/csv.js";
import { ServiceUnavailableError } from "../utils/errors.js";
import { clampNumber } from "../utils/sanitize.js";

const COLUMNS = Object.freeze({
  ageCategory: "시술 당시 나이",
  procedureType: "시술 유형",
  stimulationUsed: "배란 자극 여부",
  maleFactor: "불임 원인 - 남성 요인",
  tubalDisease: "불임 원인 - 난관 질환",
  ovulatoryDisorder: "불임 원인 - 배란 장애",
  endometriosis: "불임 원인 - 자궁내막증",
  unexplained: "불명확 불임 원인",
  totalAttempts: "총 시술 횟수",
  totalEmbryos: "총 생성 배아 수",
  success: "임신 성공 여부",
});

const REASON_KEYS = Object.freeze([
  "maleFactor",
  "tubalDisease",
  "ovulatoryDisorder",
  "endometriosis",
  "unexplained",
]);

const FACTOR_LABELS = Object.freeze({
  age: "Age Group",
  procedure: "Procedure Type",
  attempts: "Treatment Attempts",
  embryos: "Embryo Count",
  stimulation: "Ovulation Stimulation",
  maleFactor: "Male Factor",
  tubalDisease: "Tubal Disease",
  ovulatoryDisorder: "Ovulatory Disorder",
  endometriosis: "Endometriosis",
  unexplained: "Unexplained Factor",
});

function makeCounter() {
  return { total: 0, success: 0 };
}

function updateCounter(counter, target) {
  counter.total += 1;
  counter.success += target;
}

function updateMapCounter(map, key, target) {
  const normalizedKey = String(key ?? "unknown");
  if (!map.has(normalizedKey)) {
    map.set(normalizedKey, makeCounter());
  }
  updateCounter(map.get(normalizedKey), target);
}

function smoothedRate(counter, fallbackRate, alpha = 4) {
  if (!counter || counter.total === 0) {
    return fallbackRate;
  }
  return (counter.success + alpha) / (counter.total + alpha * 2);
}

function clampProbability(value) {
  return clampNumber(value, 0.01, 0.99);
}

function logit(probability) {
  const p = clampProbability(probability);
  return Math.log(p / (1 - p));
}

function sigmoid(value) {
  return 1 / (1 + Math.exp(-value));
}

function normalizeProcedure(value) {
  const normalized = String(value ?? "").trim().toUpperCase();
  if (normalized.includes("IVF") || normalized.includes("ICSI")) {
    return "IVF";
  }
  if (normalized.includes("DI") || normalized.includes("IUI")) {
    return "DI";
  }
  return "OTHER";
}

function parseAttemptsBucket(rawValue) {
  const text = String(rawValue ?? "").trim();
  const found = text.match(/(\d+)/);
  if (!found) {
    return "unknown";
  }

  const attempts = Number.parseInt(found[1], 10);
  if (text.includes("이상") || attempts >= 6) {
    return "6+";
  }
  if (attempts === 0) {
    return "0";
  }
  if (attempts <= 2) {
    return "1-2";
  }
  return "3-5";
}

function attemptsBucketFromNumber(value) {
  const attempts = Number(value);
  if (!Number.isFinite(attempts) || attempts < 0) {
    return "unknown";
  }
  if (attempts >= 6) {
    return "6+";
  }
  if (attempts === 0) {
    return "0";
  }
  if (attempts <= 2) {
    return "1-2";
  }
  return "3-5";
}

function embryosBucket(value) {
  const embryos = Number(value);
  if (!Number.isFinite(embryos) || embryos < 0) {
    return "unknown";
  }
  if (embryos === 0) {
    return "0";
  }
  if (embryos <= 2) {
    return "1-2";
  }
  if (embryos <= 5) {
    return "3-5";
  }
  return "6+";
}

function normalizeAgeCategory(age) {
  const numericAge = Number(age);
  if (!Number.isFinite(numericAge) || numericAge < 18) {
    return "알 수 없음";
  }
  if (numericAge <= 34) {
    return "만18-34세";
  }
  if (numericAge <= 37) {
    return "만35-37세";
  }
  if (numericAge <= 39) {
    return "만38-39세";
  }
  if (numericAge <= 42) {
    return "만40-42세";
  }
  if (numericAge <= 44) {
    return "만43-44세";
  }
  return "만45-50세";
}

function toReasonFlags(reasonArray) {
  const source = new Set(reasonArray);
  return {
    maleFactor: source.has("maleFactor"),
    tubalDisease: source.has("tubalDisease"),
    ovulatoryDisorder: source.has("ovulatoryDisorder"),
    endometriosis: source.has("endometriosis"),
    unexplained: source.has("unexplained"),
  };
}

class PredictionService {
  constructor({ trainDataPath }) {
    this.trainDataPath = trainDataPath;
    this.ready = false;
    this.version = "pregnancy-data-v1";
    this.stats = {
      total: makeCounter(),
      age: new Map(),
      procedure: new Map(),
      attempts: new Map(),
      embryos: new Map(),
      stimulation: new Map(),
      reasons: {
        maleFactor: new Map(),
        tubalDisease: new Map(),
        ovulatoryDisorder: new Map(),
        endometriosis: new Map(),
        unexplained: new Map(),
      },
    };
  }

  async init() {
    const stream = fs.createReadStream(this.trainDataPath, { encoding: "utf8" });
    const reader = readline.createInterface({
      input: stream,
      crlfDelay: Infinity,
    });

    let indexes = null;
    let lineNumber = 0;

    for await (const line of reader) {
      lineNumber += 1;
      if (!line.trim()) {
        continue;
      }

      const row = parseCsvLine(line);
      if (lineNumber === 1) {
        indexes = this.#buildIndexes(row);
        continue;
      }

      const targetValue = toBinary(row[indexes.success]);
      if (targetValue == null) {
        continue;
      }

      const ageCategory = String(row[indexes.ageCategory] ?? "알 수 없음").trim() || "알 수 없음";
      const procedure = normalizeProcedure(row[indexes.procedureType]);
      const attempts = parseAttemptsBucket(row[indexes.totalAttempts]);
      const embryos = embryosBucket(toNumber(row[indexes.totalEmbryos]));
      const stimulation = String(toBinary(row[indexes.stimulationUsed]) ?? "unknown");
      const reasons = {
        maleFactor: String(toBinary(row[indexes.maleFactor]) ?? "unknown"),
        tubalDisease: String(toBinary(row[indexes.tubalDisease]) ?? "unknown"),
        ovulatoryDisorder: String(toBinary(row[indexes.ovulatoryDisorder]) ?? "unknown"),
        endometriosis: String(toBinary(row[indexes.endometriosis]) ?? "unknown"),
        unexplained: String(toBinary(row[indexes.unexplained]) ?? "unknown"),
      };

      updateCounter(this.stats.total, targetValue);
      updateMapCounter(this.stats.age, ageCategory, targetValue);
      updateMapCounter(this.stats.procedure, procedure, targetValue);
      updateMapCounter(this.stats.attempts, attempts, targetValue);
      updateMapCounter(this.stats.embryos, embryos, targetValue);
      updateMapCounter(this.stats.stimulation, stimulation, targetValue);
      for (const key of REASON_KEYS) {
        updateMapCounter(this.stats.reasons[key], reasons[key], targetValue);
      }
    }

    if (this.stats.total.total === 0) {
      throw new Error("Training data could not be parsed or contains zero usable rows.");
    }

    this.ready = true;
  }

  #buildIndexes(headerRow) {
    const indexByName = new Map();
    headerRow.forEach((columnName, index) => {
      const normalized = String(columnName ?? "").replace(/^\uFEFF/, "").trim();
      indexByName.set(normalized, index);
    });

    const indexes = {};
    for (const [key, label] of Object.entries(COLUMNS)) {
      const index = indexByName.get(label);
      if (!Number.isInteger(index)) {
        throw new Error(`Required column is missing in training data: ${label}`);
      }
      indexes[key] = index;
    }
    return indexes;
  }

  health() {
    return {
      ready: this.ready,
      version: this.version,
      rows: this.stats.total.total,
    };
  }

  predict(payload) {
    if (!this.ready) {
      throw new ServiceUnavailableError("Prediction model is not ready.");
    }

    const baseRate = smoothedRate(this.stats.total, 0.35, 8);
    const baseLogit = logit(baseRate);
    let scoreLogit = baseLogit;

    const reasonFlags = toReasonFlags(payload.infertilityReason);
    const featureValues = {
      age: normalizeAgeCategory(payload.age),
      procedure: normalizeProcedure(payload.procedureType),
      attempts: attemptsBucketFromNumber(payload.historyAttempts),
      embryos: embryosBucket(payload.embryoCount),
      stimulation: String(payload.stimulationUsed ? 1 : 0),
      reasons: {
        maleFactor: String(reasonFlags.maleFactor ? 1 : 0),
        tubalDisease: String(reasonFlags.tubalDisease ? 1 : 0),
        ovulatoryDisorder: String(reasonFlags.ovulatoryDisorder ? 1 : 0),
        endometriosis: String(reasonFlags.endometriosis ? 1 : 0),
        unexplained: String(reasonFlags.unexplained ? 1 : 0),
      },
    };

    const weights = {
      age: 0.85,
      procedure: 0.55,
      attempts: 0.5,
      embryos: 0.75,
      stimulation: 0.25,
      reason: 0.18,
    };

    const featureRates = {
      age: smoothedRate(this.stats.age.get(featureValues.age), baseRate),
      procedure: smoothedRate(this.stats.procedure.get(featureValues.procedure), baseRate),
      attempts: smoothedRate(this.stats.attempts.get(featureValues.attempts), baseRate),
      embryos: smoothedRate(this.stats.embryos.get(featureValues.embryos), baseRate),
      stimulation: smoothedRate(this.stats.stimulation.get(featureValues.stimulation), baseRate),
      reasons: {},
    };

    const featureSampleSizes = {
      age: this.stats.age.get(featureValues.age)?.total ?? 0,
      procedure: this.stats.procedure.get(featureValues.procedure)?.total ?? 0,
      attempts: this.stats.attempts.get(featureValues.attempts)?.total ?? 0,
      embryos: this.stats.embryos.get(featureValues.embryos)?.total ?? 0,
      stimulation: this.stats.stimulation.get(featureValues.stimulation)?.total ?? 0,
      reasons: {},
    };

    for (const key of REASON_KEYS) {
      const counter = this.stats.reasons[key].get(featureValues.reasons[key]);
      featureRates.reasons[key] = smoothedRate(counter, baseRate);
      featureSampleSizes.reasons[key] = counter?.total ?? 0;
    }

    const contributions = [];
    const applyFeature = (name, rate, weight) => {
      const contribution = weight * (logit(rate) - baseLogit);
      scoreLogit += contribution;
      contributions.push({
        name,
        contribution,
      });
      return contribution;
    };

    applyFeature("age", featureRates.age, weights.age);
    applyFeature("procedure", featureRates.procedure, weights.procedure);
    applyFeature("attempts", featureRates.attempts, weights.attempts);
    applyFeature("embryos", featureRates.embryos, weights.embryos);
    applyFeature("stimulation", featureRates.stimulation, weights.stimulation);

    for (const key of REASON_KEYS) {
      applyFeature(key, featureRates.reasons[key], weights.reason);
    }

    const probability = clampProbability(sigmoid(scoreLogit));
    const probabilityPercent = Math.round(probability * 100);

    const cohortMean = clampProbability(
      (featureRates.age + featureRates.procedure + featureRates.attempts + featureRates.embryos + featureRates.stimulation) /
        5
    );

    const allSampleSizes = [
      featureSampleSizes.age,
      featureSampleSizes.procedure,
      featureSampleSizes.attempts,
      featureSampleSizes.embryos,
      featureSampleSizes.stimulation,
      ...Object.values(featureSampleSizes.reasons),
    ].filter((value) => Number.isFinite(value) && value > 0);
    const effectiveSampleSize = Math.max(
      20,
      allSampleSizes.length > 0 ? Math.min(...allSampleSizes) : this.stats.total.total
    );

    const margin = clampNumber(
      1.96 * Math.sqrt((probability * (1 - probability)) / effectiveSampleSize),
      0.03,
      0.2
    );
    const ciLow = clampProbability(probability - margin);
    const ciHigh = clampProbability(probability + margin);

    const cohortSpread = Math.max(
      0.06,
      Math.min(0.22, Math.sqrt((cohortMean * (1 - cohortMean)) / Math.max(40, effectiveSampleSize)) * 4)
    );
    const cohortPercentile = Math.round(clampNumber(50 + ((probability - cohortMean) / cohortSpread) * 18, 1, 99));

    let message = "Pregnancy success probability is moderate. Discuss next steps with a specialist.";
    if (probabilityPercent >= 60) {
      message = "Pregnancy success probability is relatively high for the provided profile.";
    } else if (probabilityPercent < 35) {
      message = "Pregnancy success probability is currently low. A specialist review is recommended.";
    }

    const topFactors = contributions
      .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
      .slice(0, 5)
      .map((item) => ({
        name: FACTOR_LABELS[item.name] ?? item.name,
        direction: item.contribution >= 0 ? "up" : "down",
        strength: Number(clampNumber(Math.abs(item.contribution) / 1.4, 0.05, 1).toFixed(3)),
      }));

    return {
      probability: probabilityPercent,
      message,
      modelVersion: this.version,
      calibratedProbability: Number(probability.toFixed(4)),
      confidenceInterval: {
        low: Number(ciLow.toFixed(4)),
        high: Number(ciHigh.toFixed(4)),
        effectiveSampleSize,
      },
      cohortMean: Number(cohortMean.toFixed(4)),
      cohortPercentile,
      topFactors,
      features: {
        ageCategory: featureValues.age,
        procedureGroup: featureValues.procedure,
        attemptsBucket: featureValues.attempts,
        embryosBucket: featureValues.embryos,
      },
    };
  }
}

export { PredictionService, normalizeAgeCategory, normalizeProcedure, embryosBucket, attemptsBucketFromNumber };
