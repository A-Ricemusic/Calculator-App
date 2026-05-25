import { evaluateCalculatorExpression } from "./calculatorMath";

const percentageOperators: Record<string, string> = {
  "+": "+",
  "-": "-",
  "−": "-",
  x: "x",
  "×": "x",
  "/": "/",
  "÷": "/",
};

function hasTrailingOperator(value: string) {
  return /[+\-x/]$/.test(value);
}

export function normalizePercentageOperator(value: string) {
  return percentageOperators[value];
}

export function appendPercentageOperator(current: string, operator: string) {
  const normalizedOperator = normalizePercentageOperator(operator);

  if (!normalizedOperator) {
    return current;
  }

  if (!current || current === "-") {
    return current;
  }

  return hasTrailingOperator(current)
    ? `${current.slice(0, -1)}${normalizedOperator}`
    : `${current}${normalizedOperator}`;
}

export function parsePercentageInput(value: string) {
  if (value === "" || value === "-") {
    return 0;
  }

  const directValue = Number(value);

  if (Number.isFinite(directValue)) {
    return directValue;
  }

  return evaluateCalculatorExpression(value);
}
