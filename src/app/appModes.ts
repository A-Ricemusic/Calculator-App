export type AppMode =
  | "basic"
  | "scientific"
  | "fraction"
  | "percentage"
  | "calculus"
  | "conversion"
  | "graphing"
  | "notes";
export type CalculatorMode = Extract<AppMode, "basic" | "scientific" | "fraction" | "percentage">;
