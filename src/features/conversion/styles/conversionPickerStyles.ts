import { StyleSheet } from "react-native";

import type { CalculatorTheme } from "@features/theme";

export function createConversionPickerStyles(theme: CalculatorTheme) {
  return {
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
  } as const;
}
