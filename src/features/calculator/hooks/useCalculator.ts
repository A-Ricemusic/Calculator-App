import { useMemo, useState } from "react";

import type { ButtonConfig, CalculatorMode, Operator } from "../types";
import { calculate, factorial, formatValue } from "../utils/calculatorMath";

export function useCalculator(mode: CalculatorMode) {
  const [display, setDisplay] = useState("0");
  const [storedValue, setStoredValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const clearLabel = useMemo(
    () => (mode === "scientific" ? (display === "0" ? "ac" : "c") : display === "0" ? "AC" : "C"),
    [display, mode],
  );

  function resetAll() {
    setDisplay("0");
    setStoredValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  }

  function inputDigit(digit: string) {
    if (display === "Error") {
      setDisplay(digit);
      return;
    }

    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
      return;
    }

    setDisplay((current) => (current === "0" ? digit : `${current}${digit}`));
  }

  function inputDecimal() {
    if (waitingForOperand || display === "Error") {
      setDisplay("0.");
      setWaitingForOperand(false);
      return;
    }

    if (!display.includes(".")) {
      setDisplay((current) => `${current}.`);
    }
  }

  function applyUnary(action: string) {
    const value = Number(display);
    const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;

    const resultByAction: Record<string, number> = {
      square: value ** 2,
      cube: value ** 3,
      reciprocal: 1 / value,
      sqrt: Math.sqrt(value),
      cbrt: Math.cbrt(value),
      exp: Math.exp(value),
      pow10: 10 ** value,
      ln: Math.log(value),
      log10: Math.log10(value),
      factorial: factorial(value),
      sin: Math.sin(degreesToRadians(value)),
      cos: Math.cos(degreesToRadians(value)),
      tan: Math.tan(degreesToRadians(value)),
      sinh: Math.sinh(value),
      cosh: Math.cosh(value),
      tanh: Math.tanh(value),
    };

    setDisplay(formatValue(resultByAction[action]));
    setWaitingForOperand(true);
  }

  function performOperation(nextOperator: Operator) {
    const inputValue = Number(display);

    if (storedValue === null) {
      setStoredValue(inputValue);
    } else if (operator) {
      const result = calculate(storedValue, inputValue, operator);
      setDisplay(formatValue(result));
      setStoredValue(result);
    }

    setOperator(nextOperator);
    setWaitingForOperand(true);
  }

  function handleEquals() {
    if (storedValue === null || operator === null) {
      return;
    }

    const result = calculate(storedValue, Number(display), operator);
    setDisplay(formatValue(result));
    setStoredValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  }

  function handleClear() {
    if (display !== "0") {
      setDisplay("0");
      return;
    }

    resetAll();
  }

  function handlePress(button: ButtonConfig) {
    const action = button.action ?? button.label;

    if (/^\d$/.test(action)) {
      inputDigit(action);
      return;
    }

    if (action === ".") {
      inputDecimal();
      return;
    }

    if (action === "clear") {
      handleClear();
      return;
    }

    if (action === "sign") {
      setDisplay((current) => (current.startsWith("-") ? current.slice(1) : `-${current}`));
      return;
    }

    if (action === "percent") {
      setDisplay((current) => formatValue(Number(current) / 100));
      return;
    }

    if (action === "equals") {
      handleEquals();
      return;
    }

    if (action === "backspace") {
      setDisplay((current) => (current.length > 1 ? current.slice(0, -1) : "0"));
      return;
    }

    if (action === "pi" || action === "e" || action === "random") {
      const constants = { pi: Math.PI, e: Math.E, random: Math.random() };
      setDisplay(formatValue(constants[action]));
      setWaitingForOperand(true);
      return;
    }

    if (action === "ee") {
      setDisplay((current) => `${current}e`);
      setWaitingForOperand(false);
      return;
    }

    if (action === "root") {
      performOperation("xy");
      return;
    }

    if (
      [
        "square",
        "cube",
        "reciprocal",
        "sqrt",
        "cbrt",
        "exp",
        "pow10",
        "ln",
        "log10",
        "factorial",
        "sin",
        "cos",
        "tan",
        "sinh",
        "cosh",
        "tanh",
      ].includes(action)
    ) {
      applyUnary(action);
      return;
    }

    if (["+", "-", "x", "/", "xy"].includes(action)) {
      performOperation(action as Operator);
    }
  }

  return {
    clearLabel,
    display,
    handlePress,
    resetAll,
  };
}
