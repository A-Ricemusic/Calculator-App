import { StyleSheet } from "react-native";

import type { CalculatorTheme } from "@features/theme";
import { createConversionPickerStyles } from "./conversionPickerStyles";
import { createConversionScreenStyles } from "./conversionScreenStyles";

export function createConversionStyles(theme: CalculatorTheme) {
  return StyleSheet.create({
    ...createConversionScreenStyles(theme),
    ...createConversionPickerStyles(theme),
  });
}
