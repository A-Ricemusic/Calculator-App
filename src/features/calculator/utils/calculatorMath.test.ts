import { describe, expect, it } from "vitest";

import { calculate, evaluateCalculatorExpression, factorial, formatValue } from "./calculatorMath";

describe("calculatorMath", () => {
  it("calculates binary operations", () => {
    expect(calculate(7, 5, "+")).toBe(12);
    expect(calculate(7, 5, "-")).toBe(2);
    expect(calculate(7, 5, "x")).toBe(35);
    expect(calculate(10, 2, "/")).toBe(5);
    expect(calculate(2, 4, "xy")).toBe(16);
    expect(calculate(81, 4, "root")).toBe(3);
    expect(calculate(32, 5, "root")).toBe(2);
    expect(calculate(-8, 3, "root")).toBe(-2);
  });

  it("returns NaN when dividing by zero", () => {
    expect(calculate(10, 0, "/")).toBeNaN();
  });

  it("returns NaN for invalid roots", () => {
    expect(calculate(10, 0, "root")).toBeNaN();
    expect(calculate(-16, 2, "root")).toBeNaN();
  });

  it("handles factorial boundaries", () => {
    expect(factorial(0)).toBe(1);
    expect(factorial(5)).toBe(120);
    expect(factorial(-1)).toBeNaN();
    expect(factorial(2.5)).toBeNaN();
    expect(factorial(171)).toBeNaN();
  });

  it("evaluates grouped scientific expressions", () => {
    expect(evaluateCalculatorExpression("(2+3)x4")).toBe(20);
    expect(evaluateCalculatorExpression("2x(3+4)")).toBe(14);
    expect(evaluateCalculatorExpression("(8/2)+(3x2)")).toBe(10);
    expect(evaluateCalculatorExpression("10/(2+3)")).toBe(2);
    expect(evaluateCalculatorExpression("-2x(3+4)")).toBe(-14);
    expect(evaluateCalculatorExpression("2+-3")).toBe(-1);
    expect(evaluateCalculatorExpression("2x(-3)")).toBe(-6);
    expect(evaluateCalculatorExpression("1e3+(2x5)")).toBe(1010);
  });

  it("returns NaN for invalid grouped expressions", () => {
    expect(evaluateCalculatorExpression("(2+3")).toBeNaN();
    expect(evaluateCalculatorExpression("2x)3(")).toBeNaN();
    expect(evaluateCalculatorExpression("2+")).toBeNaN();
    expect(evaluateCalculatorExpression("2/(3-3)")).toBeNaN();
  });

  it("formats display values consistently", () => {
    expect(formatValue(Number.NaN)).toBe("Error");
    expect(formatValue(1 / 3)).toBe("0.33333333");
    expect(formatValue(10000000000)).toBe("1.000000e+10");
    expect(formatValue(0.000000001)).toBe("1.000000e-9");
  });
});
