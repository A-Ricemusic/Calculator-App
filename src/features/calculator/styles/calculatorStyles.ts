import { StyleSheet } from "react-native";

import type { CalculatorTheme } from "../../theme";

export function createCalculatorStyles(theme: CalculatorTheme) {
  return StyleSheet.create({
    displayPanel: {
      alignItems: "flex-end",
      borderBottomColor: theme.colors.divider,
      borderBottomWidth: 1,
      flexGrow: 1,
      flexShrink: 1,
      justifyContent: "flex-end",
      marginHorizontal: 16,
      maxHeight: 160,
      paddingBottom: 16,
    },
    scientificDisplay: {
      paddingBottom: 8,
    },
    display: {
      color: theme.colors.displayText,
      fontSize: 80,
      fontWeight: "200",
    },
    scientificDisplayText: {
      fontSize: 60,
    },
    sciFnSection: {
      gap: 0,
      marginHorizontal: 0,
    },
    sciFnRow: {
      flexDirection: "row",
      gap: 0,
    },
    sciFnButton: {
      alignItems: "center",
      backgroundColor: "transparent",
      borderBottomColor: theme.colors.divider,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderRightColor: theme.colors.divider,
      borderRightWidth: StyleSheet.hairlineWidth,
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 2,
      paddingVertical: 9,
    },
    sciFnButtonText: {
      color: theme.colors.sciFnText,
      fontSize: 15,
      fontWeight: "400",
    },
    keypad: {
      gap: 12,
      paddingBottom: 8,
      paddingHorizontal: 16,
      paddingTop: 18,
    },
    scientificKeypad: {
      gap: 4,
      paddingBottom: 12,
      paddingHorizontal: 8,
      paddingTop: 4,
    },
    row: {
      alignItems: "center",
      flexDirection: "row",
      gap: 10,
    },
    sciRow: {
      gap: 5,
    },
    button: {
      alignItems: "center",
      aspectRatio: 1,
      backgroundColor: theme.colors.buttonNumber,
      borderRadius: 999,
      flex: 1,
      justifyContent: "center",
    },
    sciNumButton: {
      aspectRatio: undefined,
      borderRadius: 10,
      paddingVertical: 10,
    },
    buttonWide: {
      aspectRatio: undefined,
      flex: 2.18,
    },
    buttonUtility: {
      backgroundColor: theme.colors.buttonUtility,
    },
    buttonOperator: {
      backgroundColor: theme.colors.buttonOperator,
    },
    buttonPressed: {
      opacity: 0.65,
    },
    buttonText: {
      color: theme.colors.buttonText,
      fontSize: 34,
      fontWeight: "400",
    },
    sciNumButtonText: {
      fontSize: 26,
    },
    utilityText: {
      color: theme.colors.utilityText,
    },
  });
}
