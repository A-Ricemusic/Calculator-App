import { describe, expect, it } from "vitest";

import {
  calculateFractions,
  formatFractionParts,
  partsToRational,
  rationalToImproperParts,
  rationalToParts,
} from "./fractionMath";

describe("fractionMath", () => {
  it("converts mixed fraction parts to reduced rationals", () => {
    expect(
      partsToRational({
        denominator: "6",
        numerator: "3",
        sign: -1,
        whole: "2",
      }),
    ).toEqual({
      denominator: 2,
      numerator: -5,
    });
  });

  it("calculates and reduces fraction operations", () => {
    expect(
      calculateFractions({ numerator: 1, denominator: 2 }, { numerator: 1, denominator: 3 }, "+"),
    ).toEqual({
      denominator: 6,
      numerator: 5,
    });
    expect(
      calculateFractions({ numerator: 3, denominator: 4 }, { numerator: 2, denominator: 3 }, "-"),
    ).toEqual({
      denominator: 12,
      numerator: 1,
    });
    expect(
      calculateFractions({ numerator: 2, denominator: 3 }, { numerator: 9, denominator: 10 }, "x"),
    ).toEqual({
      denominator: 5,
      numerator: 3,
    });
    expect(
      calculateFractions({ numerator: 4, denominator: 5 }, { numerator: 2, denominator: 3 }, "/"),
    ).toEqual({
      denominator: 5,
      numerator: 6,
    });
  });

  it("represents fraction division by zero as an error", () => {
    const result = calculateFractions(
      { numerator: 1, denominator: 2 },
      { numerator: 0, denominator: 1 },
      "/",
    );

    expect(result).toEqual({ denominator: 0, numerator: 0 });
    expect(formatFractionParts(rationalToParts(result))).toBe("Error");
    expect(partsToRational(rationalToParts(result))).toBeNull();
  });

  it("converts rationals to improper fraction parts", () => {
    expect(rationalToImproperParts({ denominator: 6, numerator: 7 })).toEqual({
      denominator: "6",
      numerator: "7",
      sign: 1,
      whole: "0",
    });

    expect(rationalToImproperParts({ denominator: 6, numerator: -7 })).toEqual({
      denominator: "6",
      numerator: "7",
      sign: -1,
      whole: "0",
    });
  });
});
