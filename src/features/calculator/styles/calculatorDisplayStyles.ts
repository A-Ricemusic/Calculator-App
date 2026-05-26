import type { CalculatorTheme } from "@features/theme";

export function createCalculatorDisplayStyles(theme: CalculatorTheme) {
  return {
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
    fractionDisplayPanel: {
      flexGrow: 0,
      minHeight: 90,
      paddingBottom: 10,
    },
    fractionExpression: {
      alignItems: "center",
      flexDirection: "row",
      gap: 18,
      justifyContent: "flex-end",
      maxWidth: "100%",
    },
    fractionValue: {
      alignItems: "center",
      flexDirection: "row",
      gap: 6,
    },
    fractionWhole: {
      color: theme.colors.displayText,
      fontSize: 76,
      fontWeight: "200",
    },
    fractionStack: {
      alignItems: "center",
      gap: 3,
      justifyContent: "center",
      minWidth: 54,
    },
    fractionPart: {
      color: theme.colors.displayText,
      fontSize: 42,
      fontWeight: "300",
      lineHeight: 46,
    },
    fractionBar: {
      backgroundColor: theme.colors.displayText,
      height: 3,
      width: 64,
    },
    fractionOperator: {
      color: theme.colors.displayText,
      fontSize: 68,
      fontWeight: "200",
    },
    fractionWarning: {
      color: theme.colors.displayText,
      fontSize: 16,
      marginTop: 8,
      opacity: 0.86,
    },
    fractionPlainText: {
      color: theme.colors.mutedText,
      fontSize: 18,
      marginTop: 8,
    },
  } as const;
}
