import { describe, expect, it } from "vitest";

import { calculateUnaryAction, isUnaryAction } from "./scientificOperations";

describe("scientificOperations", () => {
  it("calculates scientific unary actions", () => {
    expect(calculateUnaryAction("square", "5", true).result).toBe("25");
    expect(calculateUnaryAction("cube", "3", true).result).toBe("27");
    expect(calculateUnaryAction("reciprocal", "4", true).result).toBe("0.25");
    expect(calculateUnaryAction("sqrt", "81", true).result).toBe("9");
    expect(calculateUnaryAction("cbrt", "27", true).result).toBe("3");
    expect(calculateUnaryAction("exp", "1", true).result).toBe("2.71828183");
    expect(calculateUnaryAction("pow10", "3", true).result).toBe("1000");
    expect(calculateUnaryAction("ln", "1", true).result).toBe("0");
    expect(calculateUnaryAction("log10", "1000", true).result).toBe("3");
    expect(calculateUnaryAction("factorial", "5", true).result).toBe("120");
    expect(calculateUnaryAction("sin", "90", false).result).toBe("1");
    expect(calculateUnaryAction("cos", "0", true).result).toBe("1");
    expect(calculateUnaryAction("tan", "45", false).result).toBe("1");
    expect(calculateUnaryAction("sinh", "0", true).result).toBe("0");
    expect(calculateUnaryAction("cosh", "0", true).result).toBe("1");
    expect(calculateUnaryAction("tanh", "0", true).result).toBe("0");
  });

  it("identifies supported unary actions", () => {
    expect(isUnaryAction("sqrt")).toBe(true);
    expect(isUnaryAction("noop")).toBe(false);
  });
});
