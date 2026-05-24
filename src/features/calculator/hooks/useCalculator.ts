import { useMemo, useState } from "react";

import type { ButtonConfig, CalculatorHistoryEntry, CalculatorMode, Operator } from "../types";
import { useCalculatorHistory } from "../history/useCalculatorHistory";
import { calculate, evaluateCalculatorExpression, formatValue } from "../utils/calculatorMath";
import { calculateUnaryAction, isUnaryAction } from "../utils/scientificOperations";

function isExpressionDisplay(value: string) {
  return /[()+x\/]/.test(value) || value.slice(1).includes("-");
}

function hasTrailingBinaryOperator(value: string) {
  return /[+x\/-]$/.test(value);
}

function appendExpressionValue(current: string, value: string) {
  return current === "0" || current === "Error" ? value : `${current}${value}`;
}

export function useCalculator(mode: CalculatorMode) {
  const [display, setDisplay] = useState("0");
  const [memoryValue, setMemoryValue] = useState(0);
  const [storedValue, setStoredValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [isRadians, setIsRadians] = useState(true);
  const [isSecondFunction, setIsSecondFunction] = useState(false);
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

    if (isExpressionDisplay(display)) {
      setDisplay((current) => `${current}${digit}`);
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
    if (isExpressionDisplay(display)) {
      setDisplay((current) => {
        const currentNumber = current.split(/[()+x\/-]/).at(-1) ?? "";

        return currentNumber.includes(".") ? current : `${current}.`;
      });
      return;
    }

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
    if (isExpressionDisplay(display)) {
      const formattedResult = formatValue(evaluateCalculatorExpression(display));

      setDisplay(formattedResult);
      setStoredValue(null);
      setOperator(null);
      setWaitingForOperand(true);
      addHistoryEntry(display, formattedResult);
      return;
    }

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

  function appendParenthesis(parenthesis: "(" | ")") {
    setDisplay((current) => {
      if (
        parenthesis === "(" &&
        current !== "0" &&
        current !== "Error" &&
        current.at(-1) !== "(" &&
        !hasTrailingBinaryOperator(current)
      ) {
        return `${current}x(`;
      }

      return appendExpressionValue(current, parenthesis);
    });
    setStoredValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  }

  function handleMemoryAction(action: string) {
    const value = Number(display);

    if (action === "memoryClear") {
      setMemoryValue(0);
      return;
    }

    if (action === "memoryRecall") {
      setDisplay(formatValue(memoryValue));
      setWaitingForOperand(true);
      return;
    }

    if (!Number.isFinite(value)) {
      return;
    }

    if (action === "memoryAdd") {
      setMemoryValue((current) => current + value);
      return;
    }

    if (action === "memorySubtract") {
      setMemoryValue((current) => current - value);
    }
  }

  function appendExpressionOperator(action: string) {
    const expressionOperator = action === "x" ? "x" : action;

    setDisplay((current) =>
      hasTrailingBinaryOperator(current)
        ? `${current.slice(0, -1)}${expressionOperator}`
        : `${current}${expressionOperator}`,
    );
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
      const formattedValue = formatValue(constants[action]);
      setDisplay((current) =>
        isExpressionDisplay(current)
          ? appendExpressionValue(current, formattedValue)
          : formattedValue,
      );
      setWaitingForOperand(true);
      return;
    }

    if (action === "openParen" || action === "closeParen") {
      appendParenthesis(action === "openParen" ? "(" : ")");
      return;
    }

    if (
      action === "memoryClear" ||
      action === "memoryAdd" ||
      action === "memorySubtract" ||
      action === "memoryRecall"
    ) {
      handleMemoryAction(action);
      return;
    }

    if (action === "secondFunction") {
      setIsSecondFunction((current) => !current);
      return;
    }

    if (action === "deg") {
      setIsRadians((current) => !current);
      return;
    }

    if (action === "ee") {
      setDisplay((current) => {
        if (
          current === "Error" ||
          isExpressionDisplay(current) ||
          current.toLowerCase().includes("e")
        ) {
          return current;
        }

        return `${current}e`;
      });
      setWaitingForOperand(false);
      return;
    }

    if (action === "root") {
      performOperation("root");
      return;
    }

    if (isUnaryAction(action)) {
      applyUnary(action);
      return;
    }

    if (["+", "-", "x", "/", "xy", "root"].includes(action)) {
      if (isExpressionDisplay(display) && ["+", "-", "x", "/"].includes(action)) {
        appendExpressionOperator(action);
        return;
      }

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
    isSecondFunction,
    loadHistoryEntry,
    resetAll,
  };
}
