import { useMemo, useState } from "react";

import type { ButtonConfig, CalculatorHistoryEntry } from "../types";
import { useCalculatorHistory } from "../history/useCalculatorHistory";
import {
  calculateFractions,
  formatFractionParts,
  parseFormattedFractionParts,
  partsToRational,
  rationalToParts,
  type FractionParts,
  type Rational,
} from "../utils/fractionMath";

export type FractionField = "whole" | "numerator" | "denominator";
export type FractionDisplayMode = "mixed" | "improper";

const emptyParts: FractionParts = {
  denominator: "",
  numerator: "",
  sign: 1,
  whole: "0",
};

function appendDigit(value: string, digit: string) {
  return value === "0" ? digit : `${value}${digit}`;
}

export function useFractionCalculator() {
  const [parts, setParts] = useState<FractionParts>(emptyParts);
  const [activeField, setActiveField] = useState<FractionField>("whole");
  const [storedValue, setStoredValue] = useState<Rational | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [displayMode, setDisplayMode] = useState<FractionDisplayMode>("mixed");
  const { addHistoryEntry, clearHistory, history } = useCalculatorHistory();

  const clearLabel = useMemo(
    () => (parts.whole === "0" && !parts.numerator && !parts.denominator && !operator ? "AC" : "C"),
    [operator, parts],
  );

  const currentValue = partsToRational(parts);

  function resetAll() {
    setParts(emptyParts);
    setActiveField("whole");
    setStoredValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  }

  function inputDigit(field: FractionField, digit: string) {
    setActiveField(field);

    if (waitingForOperand) {
      setParts({ ...emptyParts, [field]: digit });
      setWaitingForOperand(false);
      return;
    }

    setParts((current) => ({
      ...current,
      [field]: appendDigit(current[field], digit),
    }));
  }

  function backspace(field: FractionField) {
    setActiveField(field);
    setParts((current) => {
      const value = current[field];
      const nextValue = value.length <= 1 ? (field === "whole" ? "0" : "") : value.slice(0, -1);

      return { ...current, [field]: nextValue };
    });
  }

  function handleClear() {
    if (parts.whole !== "0" || parts.numerator || parts.denominator) {
      setParts(emptyParts);
      setActiveField("whole");
      setWaitingForOperand(false);
      return;
    }

    resetAll();
  }

  function performOperation(nextOperator: string) {
    if (!currentValue) {
      return;
    }

    if (storedValue && operator) {
      const result = calculateFractions(storedValue, currentValue, operator);
      const resultParts = rationalToParts(result);
      addHistoryEntry(
        `${formatFractionParts(rationalToParts(storedValue))} ${operator} ${formatFractionParts(parts)}`,
        formatFractionParts(resultParts),
      );
      setStoredValue(result);
      setParts(resultParts);
    } else {
      setStoredValue(currentValue);
    }

    setOperator(nextOperator);
    setWaitingForOperand(true);
  }

  function handleEquals() {
    if (!storedValue || !operator || !currentValue) {
      return;
    }

    const result = calculateFractions(storedValue, currentValue, operator);
    const resultParts = rationalToParts(result);

    addHistoryEntry(
      `${formatFractionParts(rationalToParts(storedValue))} ${operator} ${formatFractionParts(parts)}`,
      formatFractionParts(resultParts),
    );
    setParts(resultParts);
    setStoredValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  }

  function handlePress(button: ButtonConfig) {
    const action = button.action ?? button.label;
    const field = button.field ?? activeField;

    if (/^\d$/.test(action)) {
      inputDigit(field, action);
      return;
    }

    if (action === "backspace") {
      backspace(field);
      return;
    }

    if (action === "clear") {
      handleClear();
      return;
    }

    if (action === "sign") {
      setParts((current) => ({ ...current, sign: current.sign === 1 ? -1 : 1 }));
      return;
    }

    if (action === "toggleFractionFormat") {
      setDisplayMode((current) => (current === "mixed" ? "improper" : "mixed"));
      return;
    }

    if (action === "equals") {
      handleEquals();
      return;
    }

    if (["+", "-", "x", "/"].includes(action)) {
      performOperation(action);
    }
  }

  function loadHistoryEntry(entry: CalculatorHistoryEntry) {
    setParts(parseFormattedFractionParts(entry.result) ?? emptyParts);
    setStoredValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  }

  return {
    activeField,
    clearHistory,
    clearLabel,
    currentValue,
    displayMode,
    handlePress,
    history,
    loadHistoryEntry,
    operator,
    parts,
    resetAll,
    setActiveField,
    storedValue,
    waitingForOperand,
  };
}
