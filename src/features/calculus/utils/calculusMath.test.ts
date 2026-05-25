import { describe, expect, it } from "vitest";

import {
  calculateDerivative,
  calculateIntegral,
  getSymbolicDerivative,
  getSymbolicIntegral,
} from "./calculusMath";

describe("calculusMath", () => {
  it("approximates derivatives", () => {
    expect(calculateDerivative("x^2", "3")).toBe("6");
    expect(calculateDerivative("sin(x)", "0")).toBe("1");
  });

  it("approximates definite integrals", () => {
    expect(calculateIntegral("x^2", "0", "3")).toBe("9");
    expect(calculateIntegral("cos(x)", "0", "PI")).toBe("0");
  });

  it("reports invalid input", () => {
    expect(() => calculateDerivative("", "3")).toThrow("Enter a function of x.");
    expect(() => calculateIntegral("x^2", "a", "3")).toThrow("Enter valid bounds.");
  });

  it("returns symbolic polynomial derivatives and integrals", () => {
    expect(getSymbolicDerivative("x^2")).toBe("2x");
    expect(getSymbolicDerivative("3x^2 + 4x - 7")).toBe("6x + 4");
    expect(getSymbolicDerivative("2x^sqrt(9)")).toBe("6x^2");
    expect(getSymbolicIntegral("x^2")).toBe("1/3x^3 + C");
  });

  it("handles constant and negative-power symbolic calculus", () => {
    expect(getSymbolicDerivative("7")).toBe("0");
    expect(getSymbolicDerivative("-2x^-3")).toBe("6x^-4");
    expect(getSymbolicIntegral("4")).toBe("4x + C");
    expect(getSymbolicIntegral("x^-1")).toBe("Symbolic integral unavailable");
  });
});
