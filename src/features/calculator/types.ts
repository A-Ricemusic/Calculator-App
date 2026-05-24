import type { CalculatorMode } from "@app/appModes";

export type { CalculatorMode };
export type Operator = "+" | "-" | "x" | "/" | "xy" | "root";
export type Variant = "utility" | "operator" | "number" | "scientific";

export type ButtonConfig = {
  accessibilityLabel?: string;
  active?: boolean;
  label: string;
  action?: string;
  spacer?: boolean;
  variant?: Variant;
  wide?: boolean;
};

export type CalculatorHistoryEntry = {
  id: string;
  expression: string;
  result: string;
  createdAt: number;
};
