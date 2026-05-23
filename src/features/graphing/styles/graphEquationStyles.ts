import type { CalculatorTheme } from "@features/theme";

export function createGraphEquationStyles(theme: CalculatorTheme) {
  return {
    equationPanel: {
      backgroundColor: theme.colors.screen,
      borderBottomColor: theme.colors.divider,
      borderBottomWidth: 1,
      maxHeight: 230,
    },
    equationPanelHeader: {
      alignItems: "center",
      borderBottomColor: theme.colors.divider,
      borderBottomWidth: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    equationPanelTitle: {
      color: theme.colors.topText,
      fontSize: 15,
      fontWeight: "700",
    },
    equationPanelActions: {
      alignItems: "center",
      flexDirection: "row",
      gap: 8,
    },
    collapseEquationButton: {
      alignItems: "center",
      backgroundColor: theme.colors.segmentedBackground,
      borderColor: theme.colors.divider,
      borderRadius: 16,
      borderWidth: 1,
      height: 32,
      justifyContent: "center",
      width: 32,
    },
    collapseEquationText: {
      color: theme.colors.topText,
      fontSize: 20,
      fontWeight: "700",
      lineHeight: 24,
    },
    addEquationButton: {
      alignItems: "center",
      backgroundColor: theme.colors.buttonOperator,
      borderRadius: 16,
      height: 32,
      justifyContent: "center",
      width: 32,
    },
    addEquationButtonDisabled: {
      opacity: 0.4,
    },
    addEquationText: {
      color: theme.colors.buttonText,
      fontSize: 24,
      fontWeight: "400",
      lineHeight: 28,
    },
    equationList: {
      flexGrow: 0,
    },
    equationRow: {
      alignItems: "center",
      borderBottomColor: theme.colors.divider,
      borderBottomWidth: 1,
      flexDirection: "row",
      gap: 8,
      minHeight: 56,
      paddingHorizontal: 10,
      paddingVertical: 7,
    },
    equationColorButton: {
      alignItems: "center",
      borderRadius: 15,
      height: 30,
      justifyContent: "center",
      width: 30,
    },
    equationColorDisabled: {
      opacity: 0.35,
    },
    equationInputWrap: {
      flex: 1,
      gap: 2,
    },
    equationInput: {
      color: theme.colors.topText,
      fontSize: 19,
      minHeight: 34,
      padding: 0,
    },
    equationError: {
      color: "#ef4444",
      fontSize: 11,
    },
    deleteEquationButton: {
      alignItems: "center",
      height: 34,
      justifyContent: "center",
      width: 34,
    },
    deleteEquationText: {
      color: theme.colors.mutedText,
      fontSize: 30,
      fontWeight: "200",
      lineHeight: 32,
    },
    colorPickerRow: {
      borderBottomColor: theme.colors.divider,
      borderBottomWidth: 1,
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    colorPickerSwatch: {
      alignItems: "center",
      borderRadius: 14,
      borderWidth: 2,
      height: 28,
      justifyContent: "center",
      width: 28,
    },
    colorPickerCheck: {
      color: "#ffffff",
      fontSize: 14,
      fontWeight: "700",
    },
  } as const;
}
