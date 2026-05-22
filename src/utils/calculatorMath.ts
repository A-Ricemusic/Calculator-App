import type { Operator } from '../types/calculator';

export function calculate(first: number, second: number, operator: Operator) {
  switch (operator) {
    case '+':
      return first + second;
    case '-':
      return first - second;
    case 'x':
      return first * second;
    case '/':
      return second === 0 ? Number.NaN : first / second;
    case 'xy':
      return first ** second;
  }
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
    return 'Error';
  }

  if (Math.abs(value) >= 1e10 || (Math.abs(value) > 0 && Math.abs(value) < 1e-8)) {
    return value.toExponential(6);
  }

  return Number.parseFloat(value.toFixed(8)).toString();
}
