export type AppMode = "basic" | "scientific" | "fraction" | "conversion" | "graphing" | "notes";
export type CalculatorMode = Extract<AppMode, "basic" | "scientific" | "fraction">;
