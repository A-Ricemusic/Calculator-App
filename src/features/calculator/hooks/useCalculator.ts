import { useMemo, useState } from "react";

import type { ButtonConfig, CalculatorHistoryEntry, CalculatorMode, Operator } from "../types";
import { useCalculatorHistory } from "../history/useCalculatorHistory";
import { calculate, formatValue } from "../utils/calculatorMath";
import { calculateUnaryAction, isUnaryAction } from "../utils/scientificOperations";

export function useCalculator(mode: CalculatorMode) {
  const [display, setDisplay] = useState("0");
  const [storedValue, setStoredValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [isRadians, setIsRadians] = useState(true);
  const { addHistoryEntry, clearHistory, history } = useCalculatorHistory();

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
    const { expression, result } = calculateUnaryAction(action, display, isRadians);

    setDisplay(result);
    setWaitingForOperand(true);
    addHistoryEntry(expression, result);
  }

  function performOperation(nextOperator: Operator) {
    const inputValue = Number(display);

    if (storedValue === null) {
      setStoredValue(inputValue);
    } else if (operator) {
      const result = calculate(storedValue, inputValue, operator);
      const formattedResult = formatValue(result);

      setDisplay(formattedResult);
      setStoredValue(result);
      addHistoryEntry(`${formatValue(storedValue)} ${operator} ${display}`, formattedResult);
    }

    setOperator(nextOperator);
    setWaitingForOperand(true);
  }

  function handleEquals() {
    if (storedValue === null || operator === null) {
      return;
    }

    const result = calculate(storedValue, Number(display), operator);
    const formattedResult = formatValue(result);

    setDisplay(formattedResult);
    setStoredValue(null);
    setOperator(null);
    setWaitingForOperand(true);
    addHistoryEntry(`${formatValue(storedValue)} ${operator} ${display}`, formattedResult);
  }

  function handleClear() {
    if (display !== "0") {
      setDisplay("0");
      return;
    }

    resetAll();
  }

  function handleBackspace() {
    if (display === "Error" || waitingForOperand) {
      setDisplay("0");
      setWaitingForOperand(false);
      return;
    }

    setDisplay((current) => {
      if (current.length <= 1 || (current.startsWith("-") && current.length === 2)) {
        return "0";
      }

      return current.slice(0, -1);
    });
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
      handleBackspace();
      return;
    }

    if (action === "pi" || action === "e" || action === "random") {
      const constants = { pi: Math.PI, e: Math.E, random: Math.random() };
      setDisplay(formatValue(constants[action]));
      setWaitingForOperand(true);
      return;
    }

    if (action === "deg") {
      setIsRadians((current) => !current);
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

    if (isUnaryAction(action)) {
      applyUnary(action);
      return;
    }

    if (["+", "-", "x", "/", "xy"].includes(action)) {
      performOperation(action as Operator);
    }
  }

  function loadHistoryEntry(entry: CalculatorHistoryEntry) {
    setDisplay(entry.result);
    setStoredValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  }

  return {
    clearHistory,
    clearLabel,
    display,
    handlePress,
    history,
    isRadians,
    loadHistoryEntry,
    resetAll,
  };
}
