import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import assert from "node:assert/strict";
import { PredictionService } from "../src/services/predictionService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fixturePath = path.resolve(__dirname, "fixtures", "train-mini.csv");

test("PredictionService initializes and returns probability", async () => {
  const service = new PredictionService({ trainDataPath: fixturePath });
  await service.init();

  const result = service.predict({
    age: 32,
    procedureType: "IVF",
    infertilityReason: ["ovulatoryDisorder"],
    historyAttempts: 1,
    embryoCount: 4,
    stimulationUsed: true,
  });

  assert.equal(service.health().ready, true);
  assert.equal(typeof result.probability, "number");
  assert.equal(typeof result.message, "string");
  assert.equal(result.probability >= 0 && result.probability <= 100, true);
});
