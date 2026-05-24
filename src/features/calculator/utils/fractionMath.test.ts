import { describe, expect, it } from "vitest";

import { rationalToImproperParts } from "./fractionMath";

describe("fractionMath", () => {
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
