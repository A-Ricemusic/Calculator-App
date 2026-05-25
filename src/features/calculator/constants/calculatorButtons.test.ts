import { describe, expect, it } from "vitest";

import { basicButtons, scientificFnButtons, scientificNumButtons } from "./calculatorButtons";

const supportedCalculatorActions = new Set([
  ".",
  "/",
  "+",
  "-",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "backspace",
  "cbrt",
  "clear",
  "closeParen",
  "cos",
  "cosh",
  "cube",
  "deg",
  "e",
  "ee",
  "equals",
  "exp",
  "factorial",
  "ln",
  "log10",
  "memoryAdd",
  "memoryClear",
  "memoryRecall",
  "memorySubtract",
  "openParen",
  "percent",
  "pi",
  "pow10",
  "random",
  "reciprocal",
  "root",
  "secondFunction",
  "sign",
  "sin",
  "sinh",
  "sqrt",
  "square",
  "tan",
  "tanh",
  "x",
  "xy",
]);

describe("calculatorButtons", () => {
  it("does not ship inert scientific buttons", () => {
    const scientificButtons = [...scientificFnButtons, ...scientificNumButtons].flat();

    expect(scientificButtons.map((button) => button.action)).not.toContain("noop");
  });

  it("only emits actions handled by the calculator hook", () => {
    const buttons = [...basicButtons, ...scientificFnButtons, ...scientificNumButtons].flat();
    const actions = buttons.map((button) => button.action ?? button.label);

    expect(actions.filter((action) => !supportedCalculatorActions.has(action))).toEqual([]);
  });
});
