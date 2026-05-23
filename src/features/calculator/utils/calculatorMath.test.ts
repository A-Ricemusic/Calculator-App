import { describe, expect, it } from "vitest";

import { calculate, factorial, formatValue } from "./calculatorMath";

describe("calculatorMath", () => {
  it("calculates binary operations", () => {
    expect(calculate(7, 5, "+")).toBe(12);
    expect(calculate(7, 5, "-")).toBe(2);
    expect(calculate(7, 5, "x")).toBe(35);
    expect(calculate(10, 2, "/")).toBe(5);
    expect(calculate(2, 4, "xy")).toBe(16);
  });

  it("returns NaN when dividing by zero", () => {
    expect(calculate(10, 0, "/")).toBeNaN();
  });

  it("handles factorial boundaries", () => {
    expect(factorial(0)).toBe(1);
    expect(factorial(5)).toBe(120);
    expect(factorial(-1)).toBeNaN();
    expect(factorial(2.5)).toBeNaN();
    expect(factorial(171)).toBeNaN();
  });

  it("formats display values consistently", () => {
    expect(formatValue(Number.NaN)).toBe("Error");
    expect(formatValue(1 / 3)).toBe("0.33333333");
    expect(formatValue(10000000000)).toBe("1.000000e+10");
    expect(formatValue(0.000000001)).toBe("1.000000e-9");
  });
});
