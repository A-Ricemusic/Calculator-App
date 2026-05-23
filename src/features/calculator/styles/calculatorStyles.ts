import { StyleSheet } from "react-native";

import type { CalculatorTheme } from "@features/theme";
import { createCalculatorDisplayStyles } from "./calculatorDisplayStyles";
import { createCalculatorHistoryStyles } from "./calculatorHistoryStyles";
import { createCalculatorKeypadStyles } from "./calculatorKeypadStyles";

export function createCalculatorStyles(theme: CalculatorTheme) {
  return StyleSheet.create({
    ...createCalculatorDisplayStyles(theme),
    ...createCalculatorHistoryStyles(theme),
    ...createCalculatorKeypadStyles(theme),
  });
}
