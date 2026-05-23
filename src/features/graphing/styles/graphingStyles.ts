import { StyleSheet } from "react-native";

import type { CalculatorTheme } from "../../theme";

export function createGraphingStyles(theme: CalculatorTheme) {
  return StyleSheet.create({
    graphingRoot: {
      backgroundColor: "#f8f8f6",
      flex: 1,
    },
    graphingBody: {
      flex: 1,
    },
    equationPanel: {
      backgroundColor: "#ffffff",
      borderBottomColor: "#d7d7d2",
      borderBottomWidth: 1,
      maxHeight: 230,
    },
    equationPanelHeader: {
      alignItems: "center",
      borderBottomColor: "#e5e5df",
      borderBottomWidth: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    equationPanelTitle: {
      color: "#222222",
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
      backgroundColor: "#f3f3ef",
      borderColor: "#d7d7d2",
      borderRadius: 16,
      borderWidth: 1,
      height: 32,
      justifyContent: "center",
      width: 32,
    },
    collapseEquationText: {
      color: "#555555",
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
      borderBottomColor: "#eeeeea",
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
      color: "#1f1f1f",
      fontSize: 19,
      minHeight: 34,
      padding: 0,
    },
    equationError: {
      color: "#b42318",
      fontSize: 11,
    },
    deleteEquationButton: {
      alignItems: "center",
      height: 34,
      justifyContent: "center",
      width: 34,
    },
    deleteEquationText: {
      color: "#999999",
      fontSize: 30,
      fontWeight: "200",
      lineHeight: 32,
    },
    graphArea: {
      flex: 1,
    },
    graphControls: {
      gap: 8,
      position: "absolute",
      right: 12,
      top: 12,
    },
    graphControlButton: {
      alignItems: "center",
      backgroundColor: "#ffffff",
      borderColor: "#d6d6d1",
      borderRadius: 6,
      borderWidth: 1,
      height: 38,
      justifyContent: "center",
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.16,
      shadowRadius: 2,
      width: 38,
    },
    graphControlText: {
      color: "#555555",
      fontSize: 22,
      fontWeight: "600",
    },
  });
}
