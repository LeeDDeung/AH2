function stripControlChars(value) {
  return value.replace(/[\u0000-\u001F\u007F]/g, " ");
}

function sanitizeText(value, maxLength = 1_000) {
  const text = typeof value === "string" ? value : String(value ?? "");
  const normalized = stripControlChars(text).replace(/\s+/g, " ").trim();
  return normalized.slice(0, maxLength);
}

function clampNumber(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function coerceOptionalInteger(value, fallback = 0) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export { sanitizeText, clampNumber, coerceOptionalInteger };
