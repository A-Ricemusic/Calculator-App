import type { Operator } from "../types";

type ExpressionToken =
  | { type: "number"; value: number }
  | { type: "operator"; value: Operator }
  | { type: "paren"; value: "(" | ")" };

const operatorPrecedence: Record<Operator, number> = {
  "+": 1,
  "-": 1,
  x: 2,
  "/": 2,
  root: 3,
  xy: 3,
};

export function calculate(first: number, second: number, operator: Operator) {
  switch (operator) {
    case "+":
      return first + second;
    case "-":
      return first - second;
    case "x":
      return first * second;
    case "/":
      return second === 0 ? Number.NaN : first / second;
    case "xy":
      return first ** second;
    case "root":
      if (second === 0) {
        return Number.NaN;
      }

      if (first < 0 && Number.isInteger(second) && Math.abs(second % 2) === 1) {
        return -(Math.abs(first) ** (1 / second));
      }

      return first ** (1 / second);
  }
}

function isExpressionOperator(value: string) {
  return value === "+" || value === "-" || value === "x" || value === "/";
}

function normalizeExpression(expression: string) {
  return expression.replaceAll("×", "x").replaceAll("÷", "/").replaceAll("−", "-");
}

function shouldTreatSignAsNumber(expression: string, index: number, tokens: ExpressionToken[]) {
  const next = expression[index + 1];
  const previousToken = tokens.at(-1);

  return (
    expression[index] === "-" &&
    Boolean(next) &&
    /[\d.]/.test(next) &&
    (!previousToken ||
      previousToken.type === "operator" ||
      (previousToken.type === "paren" && previousToken.value === "("))
  );
}

function tokenizeExpression(expression: string) {
  const normalizedExpression = normalizeExpression(expression);
  const tokens: ExpressionToken[] = [];
  let index = 0;

  while (index < normalizedExpression.length) {
    const character = normalizedExpression[index];

    if (character === " ") {
      index += 1;
      continue;
    }

    if (/[\d.]/.test(character) || shouldTreatSignAsNumber(normalizedExpression, index, tokens)) {
      const start = index;
      index += 1;

      while (index < normalizedExpression.length && /[\d.eE+-]/.test(normalizedExpression[index])) {
        const current = normalizedExpression[index];
        const previous = normalizedExpression[index - 1];

        if ((current === "+" || current === "-") && previous.toLowerCase() !== "e") {
          break;
        }

        index += 1;
      }

      const value = Number(normalizedExpression.slice(start, index));

      if (!Number.isFinite(value)) {
        return null;
      }

      tokens.push({ type: "number", value });
      continue;
    }

    if (isExpressionOperator(character)) {
      tokens.push({ type: "operator", value: character as Operator });
      index += 1;
      continue;
    }

    if (character === "(" || character === ")") {
      tokens.push({ type: "paren", value: character });
      index += 1;
      continue;
    }

    return null;
  }

  return tokens;
}

function applyExpressionOperator(values: number[], operator: Operator) {
  const second = values.pop();
  const first = values.pop();

  if (first === undefined || second === undefined) {
    return false;
  }

  values.push(calculate(first, second, operator));
  return true;
}

export function evaluateCalculatorExpression(expression: string) {
  const tokens = tokenizeExpression(expression);

  if (!tokens) {
    return Number.NaN;
  }

  const values: number[] = [];
  const operators: Array<Operator | "("> = [];

  for (const token of tokens) {
    if (token.type === "number") {
      values.push(token.value);
      continue;
    }

    if (token.type === "paren") {
      if (token.value === "(") {
        operators.push(token.value);
        continue;
      }

      while (operators.length > 0 && operators.at(-1) !== "(") {
        const operator = operators.pop();

        if (!operator || operator === "(" || !applyExpressionOperator(values, operator)) {
          return Number.NaN;
        }
      }

      if (operators.pop() !== "(") {
        return Number.NaN;
      }
      continue;
    }

    while (
      operators.length > 0 &&
      operators.at(-1) !== "(" &&
      operatorPrecedence[operators.at(-1) as Operator] >= operatorPrecedence[token.value]
    ) {
      const operator = operators.pop();

      if (!operator || operator === "(" || !applyExpressionOperator(values, operator)) {
        return Number.NaN;
      }
    }

    operators.push(token.value);
  }

  while (operators.length > 0) {
    const operator = operators.pop();

    if (!operator || operator === "(" || !applyExpressionOperator(values, operator)) {
      return Number.NaN;
    }
  }

  return values.length === 1 ? values[0] : Number.NaN;
}

export function factorial(value: number) {
  if (value < 0 || !Number.isInteger(value) || value > 170) {
    return Number.NaN;
  }

  let result = 1;
  for (let index = 2; index <= value; index += 1) {
    result *= index;
  }
  return result;
}

export function formatValue(value: number) {
  if (!Number.isFinite(value)) {
    return "Error";
  }

  if (Math.abs(value) >= 1e10 || (Math.abs(value) > 0 && Math.abs(value) < 1e-8)) {
    return value.toExponential(6);
  }

  return Number.parseFloat(value.toFixed(8)).toString();
}
