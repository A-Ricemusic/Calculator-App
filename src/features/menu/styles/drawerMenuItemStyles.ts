import { StyleSheet } from "react-native";

import type { CalculatorTheme } from "@features/theme";

export function createDrawerMenuItemStyles(theme: CalculatorTheme) {
  return {
    menuItem: {
      alignItems: "center",
      flexDirection: "row",
      paddingHorizontal: 14,
      paddingVertical: 14,
    },
    menuItemBorder: {
      borderBottomColor: "rgba(255, 255, 255, 0.08)",
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    menuIcon: {
      color: theme.colors.mutedText,
      fontSize: 18,
      marginRight: 14,
      textAlign: "center",
      width: 28,
    },
    menuText: {
      color: theme.colors.topText,
      flex: 1,
      fontSize: 17,
      fontWeight: "400",
    },
    menuTextStack: {
      flex: 1,
      gap: 2,
    },
    menuSubtext: {
      color: theme.colors.mutedText,
      fontSize: 13,
      fontWeight: "500",
    },
    menuTextActive: {
      fontWeight: "600",
    },
    menuCheck: {
      color: theme.colors.segmentedActive,
      fontSize: 18,
      fontWeight: "600",
    },
    themeRow: {
      alignItems: "center",
      flexDirection: "row",
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    themeRowActive: {
      backgroundColor: theme.colors.drawerActive,
    },
    themeSwatch: {
      alignItems: "center",
      borderRadius: 8,
      height: 36,
      justifyContent: "center",
      marginRight: 14,
      width: 36,
    },
    themeSwatchAccent: {
      borderRadius: 999,
      height: 16,
      width: 16,
    },
    themeCheck: {
      color: theme.colors.segmentedActive,
      fontSize: 16,
      fontWeight: "700",
    },
    themeDot: {
      alignItems: "center",
      justifyContent: "center",
      marginRight: 14,
      width: 28,
    },
    themeMenuItem: {
      paddingLeft: 28,
    },
    themeDotInner: {
      borderRadius: 999,
      height: 18,
      width: 18,
    },
  } as const;
}
