import { describe, expect, it } from "vitest";

import {
  appendExpressionValue,
  hasTrailingBinaryOperator,
  isExpressionDisplay,
  toggleCalculatorSign,
} from "./calculatorInput";

describe("calculatorInput", () => {
  it("identifies expression displays", () => {
    expect(isExpressionDisplay("12")).toBe(false);
    expect(isExpressionDisplay("-12")).toBe(false);
    expect(isExpressionDisplay("2+3")).toBe(true);
    expect(isExpressionDisplay("2x(3+4)")).toBe(true);
  });

  it("detects trailing binary operators", () => {
    expect(hasTrailingBinaryOperator("2+")).toBe(true);
    expect(hasTrailingBinaryOperator("2x")).toBe(true);
    expect(hasTrailingBinaryOperator("-2")).toBe(false);
  });

  it("appends expression values from empty display states", () => {
    expect(appendExpressionValue("0", "(")).toBe("(");
    expect(appendExpressionValue("Error", "3")).toBe("3");
    expect(appendExpressionValue("2+", "3")).toBe("2+3");
  });

  it("toggles signs without corrupting error or expression input", () => {
    expect(toggleCalculatorSign("Error")).toBe("Error");
    expect(toggleCalculatorSign("12")).toBe("-12");
    expect(toggleCalculatorSign("-12")).toBe("12");
    expect(toggleCalculatorSign("2+3")).toBe("2+-3");
    expect(toggleCalculatorSign("2+-3")).toBe("2+3");
    expect(toggleCalculatorSign("2x(3")).toBe("2x(-3");
    expect(toggleCalculatorSign("2+")).toBe("2+-");
  });
});
