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
      backgroundColor: "rgba(19, 20, 22, 0.98)",
      borderColor: "rgba(255, 255, 255, 0.14)",
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      borderWidth: 1,
      gap: 14,
      maxHeight: "86%",
      minHeight: "52%",
      overflow: "hidden",
      paddingBottom: 18,
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
      minHeight: 52,
    },
    historyTitle: {
      color: theme.colors.displayText,
      fontSize: 26,
      fontWeight: "700",
    },
    historySubtitle: {
      color: theme.colors.mutedText,
      fontSize: 13,
      fontWeight: "500",
      marginTop: 2,
    },
    historyActions: {
      alignItems: "center",
      flexDirection: "row",
      gap: 10,
    },
    historyClearButton: {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      borderColor: "rgba(255, 255, 255, 0.12)",
      borderRadius: 8,
      borderWidth: 1,
      minWidth: 54,
      paddingHorizontal: 12,
      paddingVertical: 8,
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
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderRadius: 20,
      height: 40,
      justifyContent: "center",
      width: 40,
    },
    historyCloseText: {
      color: theme.colors.topText,
      fontSize: 30,
      fontWeight: "200",
      lineHeight: 34,
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
    historyScroll: {
      flex: 1,
      minHeight: 0,
    },
    historyList: {
      gap: 10,
      paddingBottom: 10,
    },
    historyItem: {
      backgroundColor: "rgba(255, 255, 255, 0.075)",
      borderColor: "rgba(255, 255, 255, 0.1)",
      borderRadius: 10,
      borderWidth: 1,
      justifyContent: "center",
      minHeight: 76,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    historyExpression: {
      color: theme.colors.mutedText,
      fontSize: 16,
      fontWeight: "500",
    },
    historyResult: {
      color: theme.colors.displayText,
      fontSize: 26,
      fontWeight: "600",
      marginTop: 4,
    },
  } as const;
}
