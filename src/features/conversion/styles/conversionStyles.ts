import { StyleSheet } from "react-native";

import type { CalculatorTheme } from "../../theme";

export function createConversionStyles(theme: CalculatorTheme) {
  return StyleSheet.create({
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
      color: theme.colors.buttonText,
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
    conversionPickerContainer: {
      backgroundColor: theme.colors.screen,
      flex: 1,
    },
    conversionPickerHeader: {
      alignItems: "center",
      borderBottomColor: theme.colors.divider,
      borderBottomWidth: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    conversionPickerTitle: {
      color: theme.colors.topText,
      fontSize: 18,
      fontWeight: "700",
    },
    conversionPickerDone: {
      paddingHorizontal: 4,
      paddingVertical: 4,
    },
    conversionPickerDoneText: {
      color: theme.colors.segmentedActive,
      fontSize: 17,
      fontWeight: "600",
    },
    conversionPickerList: {
      paddingHorizontal: 20,
      paddingVertical: 8,
    },
    conversionPickerItem: {
      alignItems: "center",
      borderBottomColor: theme.colors.divider,
      borderBottomWidth: StyleSheet.hairlineWidth,
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 4,
      paddingVertical: 16,
    },
    conversionPickerItemActive: {
      borderBottomColor: theme.colors.divider,
    },
    conversionPickerItemText: {
      color: theme.colors.topText,
      fontSize: 17,
      fontWeight: "400",
    },
    conversionPickerItemTextActive: {
      color: theme.colors.segmentedActive,
      fontWeight: "600",
    },
    conversionPickerItemSymbol: {
      color: theme.colors.mutedText,
      fontSize: 15,
      marginLeft: 8,
    },
    conversionPickerItemRow: {
      alignItems: "center",
      flexDirection: "row",
      gap: 12,
    },
    conversionPickerCheck: {
      color: theme.colors.segmentedActive,
      fontSize: 18,
      fontWeight: "700",
    },
  });
}
