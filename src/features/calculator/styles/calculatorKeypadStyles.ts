import { StyleSheet } from "react-native";

import type { CalculatorTheme } from "@features/theme";

export function createCalculatorKeypadStyles(theme: CalculatorTheme) {
  return {
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
    sciFnButtonActive: {
      backgroundColor: theme.colors.buttonScientific,
    },
    sciFnButtonActiveText: {
      color: theme.colors.buttonText,
    },
    keypad: {
      gap: 12,
      paddingBottom: 12,
      paddingHorizontal: 16,
      paddingTop: 16,
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
      gap: 12,
      justifyContent: "space-between",
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
      flex: 2,
    },
    buttonSpacer: {
      backgroundColor: "transparent",
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
    operatorText: {
      color: theme.colors.operatorText,
    },
    sciNumButtonText: {
      fontSize: 26,
    },
    utilityText: {
      color: theme.colors.utilityText,
    },
    fractionKeypad: {
      gap: 10,
      paddingBottom: 12,
      paddingHorizontal: 12,
      paddingTop: 10,
    },
    fractionTopRow: {
      flexDirection: "row",
      gap: 10,
    },
    fractionBody: {
      flexDirection: "row",
      gap: 10,
    },
    fractionNumberBlock: {
      flex: 1,
      gap: 7,
    },
    fractionStackedPads: {
      flex: 1.55,
      gap: 7,
    },
    fractionOperatorColumn: {
      flex: 0.72,
      gap: 10,
    },
    fractionSmallRow: {
      flexDirection: "row",
      gap: 7,
    },
    fractionButton: {
      alignItems: "center",
      backgroundColor: theme.colors.buttonNumber,
      borderRadius: 8,
      flex: 1,
      justifyContent: "center",
      minHeight: 58,
      paddingHorizontal: 4,
    },
    fractionTallButton: {
      minHeight: 94,
    },
    fractionWideButton: {
      flex: 2.12,
    },
    fractionActiveButton: {
      borderColor: theme.colors.displayText,
      borderWidth: 1,
    },
    fractionButtonText: {
      color: theme.colors.buttonText,
      fontSize: 32,
      fontWeight: "300",
    },
    fractionInputBar: {
      backgroundColor: theme.colors.displayText,
      height: 3,
      opacity: 0.8,
    },
  } as const;
}
