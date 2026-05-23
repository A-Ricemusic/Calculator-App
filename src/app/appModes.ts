export type AppMode = "basic" | "scientific" | "conversion" | "graphing" | "notes";
export type CalculatorMode = Extract<AppMode, "basic" | "scientific">;
