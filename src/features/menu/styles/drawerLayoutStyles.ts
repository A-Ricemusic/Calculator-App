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
      justifyContent: "space-between",
      marginBottom: 24,
    },
    drawerTitle: {
      color: theme.colors.topText,
      flex: 1,
      fontSize: 22,
      fontWeight: "700",
    },
    drawerBackButton: {
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.12)",
      borderRadius: 999,
      height: 32,
      justifyContent: "center",
      marginRight: 10,
      width: 32,
    },
    drawerBackIcon: {
      color: theme.colors.mutedText,
      fontSize: 18,
      fontWeight: "700",
      lineHeight: 20,
    },
    drawerCloseButton: {
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.12)",
      borderRadius: 999,
      height: 32,
      justifyContent: "center",
      width: 32,
    },
    drawerCloseIcon: {
      color: theme.colors.mutedText,
      fontSize: 14,
      fontWeight: "600",
    },
    drawerContent: {
      paddingBottom: 36,
    },
    drawerSectionLabel: {
      color: theme.colors.mutedText,
      fontSize: 12,
      fontWeight: "700",
      letterSpacing: 1.2,
      marginBottom: 6,
      marginTop: 8,
      paddingHorizontal: 4,
    },
    drawerSection: {
      backgroundColor: "rgba(255, 255, 255, 0.06)",
      borderRadius: 12,
      marginBottom: 20,
      overflow: "hidden",
    },
  } as const;
}
