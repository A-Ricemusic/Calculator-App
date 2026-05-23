export type CalculatorStyles = ReturnType<
  typeof import("./calculatorStyles").createCalculatorStyles
> &
  ReturnType<typeof import("../../../shared/styles/layoutStyles").createLayoutStyles>;
