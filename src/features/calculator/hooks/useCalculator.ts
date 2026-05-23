import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useMemo, useRef, useState } from "react";

import { calculatorHistoryStorageKey } from "../../../shared/constants/storageKeys";
import type { ButtonConfig, CalculatorHistoryEntry, CalculatorMode, Operator } from "../types";
import { calculate, factorial, formatValue } from "../utils/calculatorMath";

const maxHistoryEntries = 25;

const unaryLabels: Record<string, string> = {
  square: "sqr",
  cube: "cube",
  reciprocal: "1/",
  sqrt: "sqrt",
  cbrt: "cbrt",
  exp: "exp",
  pow10: "10^",
  ln: "ln",
  log10: "log",
  factorial: "!",
  sin: "sin",
  cos: "cos",
  tan: "tan",
  sinh: "sinh",
  cosh: "cosh",
  tanh: "tanh",
};

function isHistoryEntry(value: unknown): value is CalculatorHistoryEntry {
  if (!value || typeof value !== "object") {
    return false;
  }

  const entry = value as Record<string, unknown>;
  return (
    typeof entry.id === "string" &&
    typeof entry.expression === "string" &&
    typeof entry.result === "string" &&
    typeof entry.createdAt === "number"
  );
}

function createHistoryEntry(expression: string, result: string): CalculatorHistoryEntry {
  const createdAt = Date.now();
  return {
    createdAt,
    expression,
    id: `${createdAt}-${Math.random().toString(36).slice(2)}`,
    result,
  };
}

export function useCalculator(mode: CalculatorMode) {
  const [display, setDisplay] = useState("0");
  const [history, setHistory] = useState<CalculatorHistoryEntry[]>([]);
  const [storedValue, setStoredValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [isRadians, setIsRadians] = useState(true);
  const historyLoadedRef = useRef(false);

  const clearLabel = useMemo(
    () => (mode === "scientific" ? (display === "0" ? "ac" : "c") : display === "0" ? "AC" : "C"),
    [display, mode],
  );

  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      try {
        const storedHistory = await AsyncStorage.getItem(calculatorHistoryStorageKey);
        const parsedHistory = storedHistory ? JSON.parse(storedHistory) : [];

        if (!cancelled && Array.isArray(parsedHistory)) {
          setHistory(parsedHistory.filter(isHistoryEntry).slice(0, maxHistoryEntries));
        }
      } catch {
        if (!cancelled) {
          setHistory([]);
        }
      } finally {
        historyLoadedRef.current = true;
      }
    }

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!historyLoadedRef.current) {
      return;
    }

    AsyncStorage.setItem(calculatorHistoryStorageKey, JSON.stringify(history)).catch(() => {});
  }, [history]);

  function addHistoryEntry(expression: string, result: string) {
    if (result === "Error" || !Number.isFinite(Number(result))) {
      return;
    }

    setHistory((current) =>
      [createHistoryEntry(expression, result), ...current].slice(0, maxHistoryEntries),
    );
  }

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
    const trigInput = isRadians ? value : (value * Math.PI) / 180;

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
      sin: Math.sin(trigInput),
      cos: Math.cos(trigInput),
      tan: Math.tan(trigInput),
      sinh: Math.sinh(value),
      cosh: Math.cosh(value),
      tanh: Math.tanh(value),
    };

    const result = formatValue(resultByAction[action]);
    const label = unaryLabels[action] ?? action;
    const expression = action === "factorial" ? `${display}!` : `${label}(${display})`;

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

  function loadHistoryEntry(entry: CalculatorHistoryEntry) {
    setDisplay(entry.result);
    setStoredValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  }

  function clearHistory() {
    setHistory([]);
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
