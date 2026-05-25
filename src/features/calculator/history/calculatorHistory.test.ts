import { describe, expect, it } from "vitest";

import { shouldStoreHistoryResult } from "./calculatorHistory";

describe("calculator history", () => {
  it("stores numeric, fraction, and percentage results", () => {
    expect(shouldStoreHistoryResult("12")).toBe(true);
    expect(shouldStoreHistoryResult("1/2")).toBe(true);
    expect(shouldStoreHistoryResult("200%")).toBe(true);
  });

  it("skips empty and invalid results", () => {
    expect(shouldStoreHistoryResult("")).toBe(false);
    expect(shouldStoreHistoryResult("Error")).toBe(false);
    expect(shouldStoreHistoryResult("NaN%")).toBe(false);
  });
});
