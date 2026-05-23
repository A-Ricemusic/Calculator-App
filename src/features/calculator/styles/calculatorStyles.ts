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
    historyOverlay: {
      flex: 1,
      justifyContent: "flex-end",
    },
    historyBackdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.55)",
    },
    historySheet: {
      backgroundColor: "rgba(18, 18, 18, 0.96)",
      borderColor: "rgba(255, 255, 255, 0.12)",
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      borderWidth: 1,
      gap: 16,
      minHeight: "58%",
      paddingBottom: 28,
      paddingHorizontal: 20,
      paddingTop: 12,
    },
    historyGrabber: {
      alignSelf: "center",
      backgroundColor: "rgba(255, 255, 255, 0.42)",
      borderRadius: 999,
      height: 5,
      width: 74,
    },
    historyHeader: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    historyTitle: {
      color: theme.colors.mutedText,
      fontSize: 13,
      fontWeight: "600",
      textTransform: "uppercase",
    },
    historyActions: {
      alignItems: "center",
      flexDirection: "row",
      gap: 10,
    },
    historyClearButton: {
      borderColor: theme.colors.divider,
      borderRadius: 8,
      borderWidth: 1,
      minWidth: 54,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    historyClearButtonDisabled: {
      opacity: 0.45,
    },
    historyClearText: {
      color: theme.colors.topText,
      fontSize: 13,
      fontWeight: "600",
      textAlign: "center",
    },
    historyClearTextDisabled: {
      color: theme.colors.mutedText,
    },
    historyCloseButton: {
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      borderRadius: 26,
      height: 52,
      justifyContent: "center",
      width: 52,
    },
    historyCloseText: {
      color: theme.colors.topText,
      fontSize: 40,
      fontWeight: "200",
      lineHeight: 44,
    },
    historyEmptyState: {
      alignItems: "center",
      flex: 1,
      justifyContent: "center",
      minHeight: 320,
    },
    historyEmptyIcon: {
      color: theme.colors.mutedText,
      fontSize: 64,
      fontWeight: "200",
      marginBottom: 10,
    },
    historyEmpty: {
      color: theme.colors.mutedText,
      fontSize: 30,
      fontWeight: "600",
    },
    historyList: {
      gap: 8,
      paddingBottom: 8,
    },
    historyItem: {
      backgroundColor: theme.colors.buttonScientific,
      borderColor: theme.colors.divider,
      borderRadius: 8,
      borderWidth: 1,
      justifyContent: "center",
      minHeight: 70,
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    historyExpression: {
      color: theme.colors.mutedText,
      fontSize: 13,
    },
    historyResult: {
      color: theme.colors.displayText,
      fontSize: 20,
      fontWeight: "500",
      marginTop: 2,
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
    sciNumButtonText: {
      fontSize: 26,
    },
    utilityText: {
      color: theme.colors.utilityText,
    },
  });
}
