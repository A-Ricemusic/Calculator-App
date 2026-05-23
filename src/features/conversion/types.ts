export type ConversionCategoryId =
  | "length"
  | "area"
  | "volume"
  | "mass"
  | "temperature"
  | "time"
  | "speed"
  | "pressure"
  | "energy"
  | "power"
  | "data"
  | "angle"
  | "fuelEconomy";

export type ConversionUnit = {
  id: string;
  label: string;
  symbol: string;
};

export type LinearConversionUnit = ConversionUnit & {
  toBaseFactor: number;
};

export type FormulaConversionUnit = ConversionUnit & {
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
};

export type ConversionCategory = {
  id: ConversionCategoryId;
  label: string;
  baseUnitId: string;
  units: readonly (LinearConversionUnit | FormulaConversionUnit)[];
};
