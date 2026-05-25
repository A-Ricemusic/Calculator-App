import { parseGraphExpression } from "../../graphing/expression/parseGraphExpression";
import { formatValue } from "../../calculator/utils/calculatorMath";

const DEFAULT_DERIVATIVE_STEP = 0.0001;
const DEFAULT_INTEGRAL_SLICES = 200;
const SIMPLE_TERM_PATTERN = /^([+-]?)(?:(\d+(?:\.\d+)?)\*?)?(x)?(?:\^([+-]?\d+(?:\.\d+)?))?$/;

function parsePositiveNumber(value: string, fallback: number) {
  const parsed = parseNumericValue(value);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseNumericValue(value: string) {
  const parsed = Number(value);

  if (Number.isFinite(parsed)) {
    return parsed;
  }

  try {
    const evaluator = parseGraphExpression(value)?.evaluate;

    return evaluator ? evaluator(0) : Number.NaN;
  } catch {
    return Number.NaN;
  }
}

function formatCalculusValue(value: number) {
  return formatValue(Math.abs(value) < 1e-12 ? 0 : value);
}

function formatCoefficient(value: number) {
  return formatCalculusValue(value);
}

function formatPowerTerm(coefficient: number, power: number) {
  if (Math.abs(coefficient) < 1e-12) {
    return "0";
  }

  if (power === 0) {
    return formatCoefficient(coefficient);
  }

  const coefficientText =
    coefficient === 1 ? "" : coefficient === -1 ? "-" : `${formatCoefficient(coefficient)}`;
  const variableText = power === 1 ? "x" : `x^${formatCalculusValue(power)}`;

  return `${coefficientText}${variableText}`;
}

function splitSimpleTerms(expression: string) {
  const normalized = expression
    .trim()
    .replace(/[−–—]/g, "-")
    .replace(/²/g, "^2")
    .replace(/³/g, "^3")
    .replace(/\s+/g, "")
    .replace(/^\+/, "");

  if (!normalized || /[()*/]/.test(normalized)) {
    return null;
  }

  return normalized.match(/[+-]?[^+-]+/g);
}

function parseSimpleTerm(term: string) {
  const match = term.match(SIMPLE_TERM_PATTERN);

  if (!match) {
    return null;
  }

  const [, signText, coefficientText, variableText, powerText] = match;
  const sign = signText === "-" ? -1 : 1;
  const hasVariable = Boolean(variableText);
  const coefficient = sign * (coefficientText ? Number(coefficientText) : 1);
  const power = hasVariable ? (powerText ? Number(powerText) : 1) : 0;

  if (!Number.isFinite(coefficient) || !Number.isFinite(power)) {
    return null;
  }

  return { coefficient: hasVariable ? coefficient : sign * Number(coefficientText), power };
}

function joinTerms(terms: string[]) {
  const nonZeroTerms = terms.filter((term) => term !== "0");

  if (nonZeroTerms.length === 0) {
    return "0";
  }

  return nonZeroTerms
    .map((term, index) => {
      if (index === 0) {
        return term;
      }

      return term.startsWith("-") ? ` - ${term.slice(1)}` : ` + ${term}`;
    })
    .join("");
}

function formatDenominator(value: number) {
  return Number.isInteger(value) ? String(value) : formatCalculusValue(value);
}

function getEvaluator(expression: string) {
  const parsedExpression = parseGraphExpression(expression);

  if (!parsedExpression) {
    throw new Error("Enter a function of x.");
  }

  return parsedExpression.evaluate;
}

function assertFinite(value: number) {
  if (!Number.isFinite(value)) {
    throw new Error("Result is undefined.");
  }
}

export function getSymbolicDerivative(expression: string) {
  const terms = splitSimpleTerms(expression);

  if (!terms) {
    return "Symbolic derivative unavailable";
  }

  const derivativeTerms = terms.map((term) => {
    const parsedTerm = parseSimpleTerm(term);

    if (!parsedTerm) {
      return null;
    }

    return formatPowerTerm(parsedTerm.coefficient * parsedTerm.power, parsedTerm.power - 1);
  });

  return derivativeTerms.includes(null)
    ? "Symbolic derivative unavailable"
    : joinTerms(derivativeTerms);
}

export function getSymbolicIntegral(expression: string) {
  const terms = splitSimpleTerms(expression);

  if (!terms) {
    return "Symbolic integral unavailable";
  }

  const integralTerms = terms.map((term) => {
    const parsedTerm = parseSimpleTerm(term);

    if (!parsedTerm || parsedTerm.power === -1) {
      return null;
    }

    const nextPower = parsedTerm.power + 1;
    const denominator = formatDenominator(nextPower);

    if (parsedTerm.coefficient === nextPower) {
      return formatPowerTerm(1, nextPower);
    }

    if (parsedTerm.coefficient === -nextPower) {
      return formatPowerTerm(-1, nextPower);
    }

    return `${formatCoefficient(parsedTerm.coefficient)}/${denominator}x^${formatCalculusValue(nextPower)}`;
  });

  return integralTerms.includes(null)
    ? "Symbolic integral unavailable"
    : `${joinTerms(integralTerms)} + C`;
}

export function calculateDerivative(
  expression: string,
  xValue: string,
  stepValue = String(DEFAULT_DERIVATIVE_STEP),
) {
  const evaluate = getEvaluator(expression);
  const x = parseNumericValue(xValue);
  const h = parsePositiveNumber(stepValue, DEFAULT_DERIVATIVE_STEP);

  if (!Number.isFinite(x)) {
    throw new Error("Enter a valid x value.");
  }

  const left = evaluate(x - h);
  const right = evaluate(x + h);
  assertFinite(left);
  assertFinite(right);

  return formatCalculusValue((right - left) / (2 * h));
}

export function calculateIntegral(
  expression: string,
  lowerValue: string,
  upperValue: string,
  sliceValue = String(DEFAULT_INTEGRAL_SLICES),
) {
  const evaluate = getEvaluator(expression);
  const lower = parseNumericValue(lowerValue);
  const upper = parseNumericValue(upperValue);
  const requestedSlices = Math.round(parsePositiveNumber(sliceValue, DEFAULT_INTEGRAL_SLICES));
  const slices = requestedSlices % 2 === 0 ? requestedSlices : requestedSlices + 1;

  if (!Number.isFinite(lower) || !Number.isFinite(upper)) {
    throw new Error("Enter valid bounds.");
  }

  if (lower === upper) {
    return "0";
  }

  const width = (upper - lower) / slices;
  let sum = evaluate(lower) + evaluate(upper);
  assertFinite(sum);

  for (let index = 1; index < slices; index += 1) {
    const value = evaluate(lower + width * index);
    assertFinite(value);
    sum += value * (index % 2 === 0 ? 2 : 4);
  }

  return formatCalculusValue((sum * width) / 3);
}
