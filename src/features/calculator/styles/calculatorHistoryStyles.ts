import { StyleSheet } from "react-native";

import type { CalculatorTheme } from "@features/theme";

export function createCalculatorHistoryStyles(theme: CalculatorTheme) {
  return {
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
  } as const;
}
