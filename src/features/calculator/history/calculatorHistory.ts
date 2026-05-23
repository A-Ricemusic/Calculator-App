import type { CalculatorHistoryEntry } from "../types";

export const maxHistoryEntries = 25;

export function isCalculatorHistoryEntry(value: unknown): value is CalculatorHistoryEntry {
  if (!value || typeof value !== "object") {
    return false;
  }

  const entry = value as Record<string, unknown>;
  return (
    typeof entry.id === "string" &&
    typeof entry.expression === "string" &&
    typeof entry.result === "string" &&
    typeof entry.createdAt === "number"
  );
}

export function createHistoryEntry(expression: string, result: string): CalculatorHistoryEntry {
  const createdAt = Date.now();
  return {
    createdAt,
    expression,
    id: `${createdAt}-${Math.random().toString(36).slice(2)}`,
    result,
  };
}

export function shouldStoreHistoryResult(result: string) {
  return result !== "Error" && Number.isFinite(Number(result));
}
