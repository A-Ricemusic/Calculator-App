import { StyleSheet } from "react-native";

import type { CalculatorTheme } from "@features/theme";

export function createDrawerLayoutStyles(theme: CalculatorTheme) {
  return {
    overlay: {
      ...StyleSheet.absoluteFillObject,
      flexDirection: "row",
    },
    scrim: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.colors.drawerScrim,
    },
    drawer: {
      backgroundColor: theme.colors.drawerBackground,
      borderBottomRightRadius: 20,
      borderTopRightRadius: 20,
      height: "100%",
      width: "72%",
    },
    drawerInner: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 12,
    },
    drawerHeader: {
      alignItems: "center",
      flexDirection: "row",
      marginBottom: 20,
      paddingVertical: 4,
    },
    drawerTitle: {
      color: theme.colors.topText,
      flex: 1,
      fontSize: 20,
      fontWeight: "700",
    },
    drawerBackButton: {
      alignItems: "center",
      borderRadius: 999,
      height: 34,
      justifyContent: "center",
      marginRight: 10,
      width: 34,
    },
    drawerBackIcon: {
      color: theme.colors.topText,
      fontSize: 24,
      fontWeight: "300",
      lineHeight: 26,
    },
    drawerCloseButton: {
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderRadius: 999,
      height: 30,
      justifyContent: "center",
      width: 30,
    },
    drawerCloseIcon: {
      color: theme.colors.mutedText,
      fontSize: 13,
      fontWeight: "600",
    },
    drawerContent: {
      paddingBottom: 36,
    },
    drawerSectionLabel: {
      color: theme.colors.mutedText,
      fontSize: 12,
      fontWeight: "600",
      letterSpacing: 1,
      marginBottom: 8,
      marginTop: 8,
      paddingHorizontal: 4,
    },
    drawerSection: {
      backgroundColor: "rgba(255, 255, 255, 0.06)",
      borderRadius: 14,
      marginBottom: 20,
      overflow: "hidden",
    },
  } as const;
}
