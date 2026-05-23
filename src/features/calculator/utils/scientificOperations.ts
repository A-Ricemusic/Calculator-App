import { factorial, formatValue } from "./calculatorMath";

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

export const unaryActions = Object.keys(unaryLabels);

export function isUnaryAction(action: string) {
  return unaryActions.includes(action);
}

export function calculateUnaryAction(action: string, display: string, isRadians: boolean) {
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

  return {
    expression: action === "factorial" ? `${display}!` : `${label}(${display})`,
    result,
  };
}
