import { StyleSheet } from "react-native";

import type { CalculatorTheme } from "@features/theme";
import { createDrawerLayoutStyles } from "./drawerLayoutStyles";
import { createDrawerMenuItemStyles } from "./drawerMenuItemStyles";

export function createDrawerStyles(theme: CalculatorTheme) {
  return StyleSheet.create({
    ...createDrawerLayoutStyles(theme),
    ...createDrawerMenuItemStyles(theme),
  });
}
