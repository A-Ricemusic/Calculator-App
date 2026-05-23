import { StyleSheet } from "react-native";

import type { CalculatorTheme } from "../../features/theme";

export function createLayoutStyles(theme: CalculatorTheme) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.screen,
    },
    appShell: {
      flex: 1,
    },
    topBar: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 12,
      paddingTop: 4,
      paddingBottom: 2,
    },
    topBarLeft: {
      alignItems: "center",
      flexDirection: "row",
      gap: 8,
    },
    topBarRight: {
      alignItems: "center",
      flexDirection: "row",
      gap: 4,
    },
    iconButton: {
      alignItems: "center",
      borderRadius: 24,
      height: 44,
      justifyContent: "center",
      width: 44,
    },
    iconText: {
      color: theme.colors.topText,
      fontSize: 28,
      fontWeight: "300",
    },
    modeTitle: {
      color: theme.colors.topText,
      fontSize: 20,
      fontWeight: "600",
    },
    angleLabel: {
      backgroundColor: theme.colors.angleBadge,
      borderRadius: 4,
      color: theme.colors.sciFnText,
      fontSize: 14,
      fontWeight: "600",
      overflow: "hidden",
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
  });
}
