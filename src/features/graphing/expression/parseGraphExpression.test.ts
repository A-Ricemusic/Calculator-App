import { describe, expect, it } from "vitest";

import { parseGraphExpression } from "./parseGraphExpression";

describe("parseGraphExpression", () => {
  it("graphs a bare expression as y = expression", () => {
    const parsed = parseGraphExpression("x^2 + 1");

    expect(parsed?.evaluate(2)).toBe(5);
    expect(parsed?.evaluate(-3)).toBe(10);
  });

  it("normalizes common math text and implicit multiplication", () => {
    const parsed = parseGraphExpression("2x squared + 3x + 1");

    expect(parsed?.evaluate(2)).toBe(15);
  });

  it("solves linear equations for y", () => {
    const parsed = parseGraphExpression("3x + 5y = 30");

    expect(parsed?.evaluate(0)).toBe(6);
    expect(parsed?.evaluate(10)).toBeCloseTo(0);
  });

  it("rejects equations without y for now", () => {
    expect(() => parseGraphExpression("x = 3")).toThrow("Equations without y");
  });

  it("reports incomplete expressions with a generic validation message", () => {
    expect(() => parseGraphExpression("3x +")).toThrow("Invalid expression");
  });
});
