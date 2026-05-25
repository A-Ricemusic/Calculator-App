import { useMemo, useState } from "react";

import type { ButtonConfig, CalculatorHistoryEntry } from "../types";
import { useCalculatorHistory } from "../history/useCalculatorHistory";
import { formatValue } from "../utils/calculatorMath";

export type PercentageOptionId =
  | "percentOfValue"
  | "percentChange"
  | "aIsPercentOfC"
  | "partValuePercent"
  | "increaseByPercent"
  | "decreaseByPercent"
  | "percentIncrease"
  | "percentDecrease"
  | "percentDifference";

type PercentageField = {
  id: string;
  label: string;
  suffix?: string;
};

type PercentageOption = {
  id: PercentageOptionId;
  title: string;
  example: string;
  fields: [PercentageField, PercentageField];
  initialValues: Record<string, string>;
  resultSuffix?: string;
  calculate: (values: Record<string, number>) => number;
};

export const percentageOptions: PercentageOption[] = [
  {
    id: "percentOfValue",
    title: "% of a value",
    example: "Eg. 50% of 100 is 50",
    fields: [
      { id: "percentage", label: "Percentage", suffix: "%" },
      { id: "value", label: "of" },
    ],
    initialValues: { percentage: "300", value: "100" },
    calculate: ({ percentage, value }) => (percentage / 100) * value,
  },
  {
    id: "percentChange",
    title: "% Change",
    example: "Eg. Changing 100 to 50 is -50%",
    fields: [
      { id: "before", label: "Before" },
      { id: "after", label: "After" },
    ],
    initialValues: { before: "300", after: "100" },
    resultSuffix: "%",
    calculate: ({ before, after }) => ((after - before) / before) * 100,
  },
  {
    id: "aIsPercentOfC",
    title: "A is %B of C",
    example: "Eg. 100 is 25% of 400",
    fields: [
      { id: "number", label: "Number" },
      { id: "percent", label: "Is", suffix: "%" },
    ],
    initialValues: { number: "100", percent: "50" },
    calculate: ({ number, percent }) => number / (percent / 100),
  },
  {
    id: "partValuePercent",
    title: "% of a Part Value",
    example: "Eg. 100 is what percent of 50, 200%",
    fields: [
      { id: "part", label: "Number" },
      { id: "whole", label: "is what % of" },
    ],
    initialValues: { part: "100", whole: "50" },
    resultSuffix: "%",
    calculate: ({ part, whole }) => (part / whole) * 100,
  },
  {
    id: "increaseByPercent",
    title: "Increase by %",
    example: "Eg. increasing 20 by 100% is 40",
    fields: [
      { id: "value", label: "Increase" },
      { id: "percent", label: "by", suffix: "%" },
    ],
    initialValues: { value: "10", percent: "100" },
    calculate: ({ value, percent }) => value * (1 + percent / 100),
  },
  {
    id: "decreaseByPercent",
    title: "Decrease by %",
    example: "Eg. decreasing 20 by 10% is 18",
    fields: [
      { id: "value", label: "Decrease" },
      { id: "percent", label: "by", suffix: "%" },
    ],
    initialValues: { value: "20", percent: "10" },
    calculate: ({ value, percent }) => value * (1 - percent / 100),
  },
  {
    id: "percentIncrease",
    title: "% Increase",
    example: "Eg. Increasing 20 to 40 is 100%",
    fields: [
      { id: "from", label: "From" },
      { id: "to", label: "to" },
    ],
    initialValues: { from: "20", to: "40" },
    resultSuffix: "%",
    calculate: ({ from, to }) => ((to - from) / from) * 100,
  },
  {
    id: "percentDecrease",
    title: "% Decrease",
    example: "Eg. 40 going down to 20 is 50%",
    fields: [
      { id: "from", label: "From" },
      { id: "to", label: "down to" },
    ],
    initialValues: { from: "40", to: "20" },
    resultSuffix: "%",
    calculate: ({ from, to }) => ((from - to) / from) * 100,
  },
  {
    id: "percentDifference",
    title: "% Difference",
    example: "Eg. Difference between 100 and 50 is 66.6667%",
    fields: [
      { id: "first", label: "Between" },
      { id: "second", label: "and" },
    ],
    initialValues: { first: "100", second: "50" },
    resultSuffix: "%",
    calculate: ({ first, second }) => (Math.abs(first - second) / ((first + second) / 2)) * 100,
  },
];

function parseInput(value: string) {
  if (value === "" || value === "-") {
    return 0;
  }

  return Number(value);
}

function formatPercentageExpression(option: PercentageOption, values: Record<string, string>) {
  return option.fields
    .map((field) => `${field.label} ${values[field.id] ?? "0"}${field.suffix ?? ""}`)
    .join(" ");
}

function stripResultSuffix(result: string) {
  return result.endsWith("%") ? result.slice(0, -1) : result;
}

function getZeroPercentageValues(option: PercentageOption) {
  return Object.fromEntries(option.fields.map((field) => [field.id, "0"]));
}

export function usePercentageCalculator() {
  const [optionId, setOptionId] = useState<PercentageOptionId>("percentOfValue");
  const option = percentageOptions.find((item) => item.id === optionId) ?? percentageOptions[0];
  const [values, setValues] = useState<Record<string, string>>(option.initialValues);
  const [activeField, setActiveField] = useState(option.fields[0].id);
  const { addHistoryEntry, clearHistory, history } = useCalculatorHistory();

  const result = useMemo(() => {
    const parsedValues = Object.fromEntries(
      option.fields.map((field) => [field.id, parseInput(values[field.id] ?? "")]),
    );

    return formatValue(option.calculate(parsedValues));
  }, [option, values]);

  function selectOption(nextOptionId: PercentageOptionId) {
    const nextOption =
      percentageOptions.find((item) => item.id === nextOptionId) ?? percentageOptions[0];

    setOptionId(nextOption.id);
    setValues(nextOption.initialValues);
    setActiveField(nextOption.fields[0].id);
  }

  function updateActiveField(update: (current: string) => string) {
    setValues((current) => ({
      ...current,
      [activeField]: update(current[activeField] ?? ""),
    }));
  }

  function handlePress(button: ButtonConfig) {
    const action = button.action ?? button.label;

    if (/^\d$/.test(action)) {
      updateActiveField((current) => (current === "0" ? action : `${current}${action}`));
      return;
    }

    if (action === ".") {
      updateActiveField((current) => {
        if (current.includes(".")) {
          return current;
        }

        return current === "-" ? "-0." : `${current || "0"}.`;
      });
      return;
    }

    if (action === "clear") {
      setValues(getZeroPercentageValues(option));
      setActiveField(option.fields[0].id);
      return;
    }

    if (action === "backspace") {
      updateActiveField((current) => (current.length <= 1 ? "0" : current.slice(0, -1)));
      return;
    }

    if (action === "sign") {
      updateActiveField((current) => (current.startsWith("-") ? current.slice(1) : `-${current}`));
      return;
    }

    if (action === "equals") {
      addHistoryEntry(
        formatPercentageExpression(option, values),
        `${result}${option.resultSuffix ?? ""}`,
      );
    }
  }

  function loadHistoryEntry(entry: CalculatorHistoryEntry) {
    setValues((current) => ({
      ...current,
      [activeField]: stripResultSuffix(entry.result),
    }));
  }

  return {
    activeField,
    clearHistory,
    handlePress,
    history,
    loadHistoryEntry,
    option,
    result,
    selectOption,
    setActiveField,
    values,
  };
}
