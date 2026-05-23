import type { CalculatorTheme } from "@features/theme";

export function createConversionScreenStyles(theme: CalculatorTheme) {
  return {
    conversionScreen: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 16,
    },
    conversionCategorySelector: {
      alignItems: "center",
      alignSelf: "center",
      backgroundColor: theme.colors.segmentedBackground,
      borderRadius: 12,
      flexDirection: "row",
      gap: 8,
      marginBottom: 24,
      paddingHorizontal: 20,
      paddingVertical: 12,
    },
    conversionCategorySelectorText: {
      color: theme.colors.topText,
      fontSize: 17,
      fontWeight: "600",
    },
    conversionChevron: {
      color: theme.colors.mutedText,
      fontSize: 16,
    },
    conversionCard: {
      backgroundColor: theme.colors.buttonScientific,
      borderRadius: 16,
      paddingHorizontal: 20,
      paddingVertical: 24,
    },
    conversionUnitSelector: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    conversionUnitLabel: {
      color: theme.colors.mutedText,
      fontSize: 15,
      fontWeight: "500",
    },
    conversionUnitSymbol: {
      color: theme.colors.segmentedActive,
      fontSize: 14,
      fontWeight: "600",
    },
    conversionInput: {
      color: theme.colors.displayText,
      fontSize: 42,
      fontWeight: "300",
      marginBottom: 4,
      minHeight: 56,
      textAlign: "left",
    },
    conversionPlaceholder: {
      color: theme.colors.mutedText,
    },
    conversionDividerRow: {
      alignItems: "center",
      flexDirection: "row",
      gap: 12,
      marginVertical: 16,
    },
    conversionDividerLine: {
      backgroundColor: theme.colors.divider,
      flex: 1,
      height: 1,
    },
    conversionSwapButton: {
      alignItems: "center",
      backgroundColor: theme.colors.buttonOperator,
      borderRadius: 20,
      height: 40,
      justifyContent: "center",
      width: 40,
    },
    conversionSwapText: {
      color: theme.colors.operatorText,
      fontSize: 20,
      fontWeight: "600",
    },
    conversionOutput: {
      color: theme.colors.displayText,
      fontSize: 42,
      fontWeight: "300",
      minHeight: 56,
      textAlign: "left",
    },
    conversionErrorText: {
      color: theme.colors.buttonOperator,
      fontSize: 34,
      fontWeight: "500",
    },
  } as const;
}
