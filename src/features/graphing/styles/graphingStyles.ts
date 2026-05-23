import { StyleSheet } from "react-native";

import type { CalculatorTheme } from "@features/theme";
import { createGraphCanvasStyles } from "./graphCanvasStyles";
import { createGraphEquationStyles } from "./graphEquationStyles";

export function createGraphingStyles(theme: CalculatorTheme) {
  return StyleSheet.create({
    graphingRoot: {
      backgroundColor: theme.colors.graphBackground,
      flex: 1,
    },
    graphingBody: {
      flex: 1,
    },
    ...createGraphEquationStyles(theme),
    ...createGraphCanvasStyles(theme),
  });
}
