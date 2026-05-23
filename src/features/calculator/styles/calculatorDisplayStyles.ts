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
  } as const;
}
