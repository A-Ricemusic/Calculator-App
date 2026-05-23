import type { ParsedGraphExpression } from "../types";

const ALLOWED_EXPRESSION = /^[0-9xy+\-*/^().,\s=MathPIEcosintaqrtlg]+$/i;

function normalizeText(input: string) {
  return input
    .trim()
    .replace(/[−–—]/g, "-")
    .replace(/²/g, "^2")
    .replace(/³/g, "^3")
    .replace(/\bsquared\b/gi, "^2")
    .replace(/\bcubed\b/gi, "^3")
    .replace(/\bpi\b/gi, "PI")
    .replace(/\s+/g, "");
}

function addImplicitMultiplication(input: string) {
  return input
    .replace(/(\d)([xy(])/gi, "$1*$2")
    .replace(/([xy)])(\d)/gi, "$1*$2")
    .replace(/([xy)])([xy(])/gi, "$1*$2")
    .replace(/(\d|[xy]|\))(?=(sin|cos|tan|sqrt|log|ln)\()/gi, "$1*");
}

function toJavaScriptExpression(input: string) {
  return addImplicitMultiplication(input)
    .replace(/\^/g, "**")
    .replace(/\bPI\b/g, "Math.PI")
    .replace(/\bE\b/g, "Math.E")
    .replace(/\bsin\(/gi, "Math.sin(")
    .replace(/\bcos\(/gi, "Math.cos(")
    .replace(/\btan\(/gi, "Math.tan(")
    .replace(/\bsqrt\(/gi, "Math.sqrt(")
    .replace(/\blog\(/gi, "Math.log10(")
    .replace(/\bln\(/gi, "Math.log(");
}

function buildEvaluator(expression: string) {
  const jsExpression = toJavaScriptExpression(expression);
  const evaluator = new Function("x", `"use strict"; return (${jsExpression});`);

  return (x: number) => {
    const value = evaluator(x);
    return typeof value === "number" ? value : Number.NaN;
  };
}

function solveLinearY(left: string, right: string) {
  const leftEval = new Function(
    "x",
    "y",
    `"use strict"; return (${toJavaScriptExpression(left)});`,
  );
  const rightEval = new Function(
    "x",
    "y",
    `"use strict"; return (${toJavaScriptExpression(right)});`,
  );
  const f = (x: number, y: number) => {
    return Number(leftEval(x, y)) - Number(rightEval(x, y));
  };

  return (x: number) => {
    const atZero = f(x, 0);
    const atOne = f(x, 1);
    const atTwo = f(x, 2);
    const coefficient = atOne - atZero;

    if (Math.abs(coefficient) < 1e-10 || Math.abs(atTwo - atOne - coefficient) > 1e-7) {
      return Number.NaN;
    }

    return -atZero / coefficient;
  };
}

export function parseGraphExpression(input: string): ParsedGraphExpression | undefined {
  const normalized = normalizeText(input);

  if (!normalized) {
    return undefined;
  }

  if (!ALLOWED_EXPRESSION.test(normalized)) {
    throw new Error("Use numbers, x, y, operators, and common functions.");
  }

  const [left, right, extra] = normalized.split("=");

  if (extra !== undefined) {
    throw new Error("Use one equals sign per equation.");
  }

  if (right === undefined) {
    const expression = left.startsWith("y=") ? left.slice(2) : left;
    return {
      kind: "explicit",
      source: normalized,
      evaluate: buildEvaluator(expression),
    };
  }

  if (!left || !right) {
    throw new Error("Both sides of the equation need a value.");
  }

  const yEqualsMatch = left === "y" ? right : right === "y" ? left : undefined;

  if (yEqualsMatch) {
    return {
      kind: "explicit",
      source: normalized,
      evaluate: buildEvaluator(yEqualsMatch),
    };
  }

  if (/[y]/i.test(left) || /[y]/i.test(right)) {
    return {
      kind: "explicit",
      source: normalized,
      evaluate: solveLinearY(left, right),
    };
  }

  throw new Error("Equations without y are not supported yet.");
}
