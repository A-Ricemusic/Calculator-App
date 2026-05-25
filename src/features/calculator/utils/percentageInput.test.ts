import { describe, expect, it } from "vitest";

import {
  appendPercentageOperator,
  normalizePercentageOperator,
  parsePercentageInput,
} from "./percentageInput";

describe("percentageInput", () => {
  it("normalizes keypad operator labels", () => {
    expect(normalizePercentageOperator("+")).toBe("+");
    expect(normalizePercentageOperator("−")).toBe("-");
    expect(normalizePercentageOperator("×")).toBe("x");
    expect(normalizePercentageOperator("÷")).toBe("/");
  });

  it("appends and replaces percentage field operators", () => {
    expect(appendPercentageOperator("7", "×")).toBe("7x");
    expect(appendPercentageOperator("7x", "÷")).toBe("7/");
    expect(appendPercentageOperator("", "+")).toBe("");
    expect(appendPercentageOperator("-", "+")).toBe("-");
  });

  it("parses arithmetic expressions in percentage fields", () => {
    expect(parsePercentageInput("7x7")).toBe(49);
    expect(parsePercentageInput("7×9−6+2")).toBe(59);
    expect(parsePercentageInput("2x6-4/6+7")).toBeCloseTo(18.333333333);
  });
});
