import type {
  ConversionCategory,
  ConversionUnit,
  FormulaConversionUnit,
  LinearConversionUnit,
} from "../types";

type Unit = LinearConversionUnit | FormulaConversionUnit;

function isFormulaUnit(unit: Unit): unit is FormulaConversionUnit {
  return "toBase" in unit;
}

export function findUnit(category: ConversionCategory, unitId: string): Unit {
  const unit = category.units.find((item) => item.id === unitId);

  if (!unit) {
    throw new Error(`Unknown conversion unit: ${unitId}`);
  }

  return unit;
}

export function convertValue(value: number, fromUnit: Unit, toUnit: Unit): number {
  const baseValue = isFormulaUnit(fromUnit)
    ? fromUnit.toBase(value)
    : value * fromUnit.toBaseFactor;

  return isFormulaUnit(toUnit) ? toUnit.fromBase(baseValue) : baseValue / toUnit.toBaseFactor;
}

export function parseConversionInput(input: string): number | null {
  const trimmed = input.trim();

  if (!trimmed) {
    return null;
  }

  const parsed = Number(trimmed);

  return Number.isFinite(parsed) ? parsed : null;
}

export function formatConversionValue(value: number): string {
  if (!Number.isFinite(value)) {
    return "Error";
  }

  if (Object.is(value, -0)) {
    return "0";
  }

  const absValue = Math.abs(value);

  if (absValue !== 0 && (absValue >= 10000000000 || absValue < 0.00000001)) {
    return value.toExponential(6);
  }

  if (Number.isInteger(value)) {
    return value.toString();
  }

  return Number(value.toPrecision(9)).toString();
}

export type { ConversionUnit };
