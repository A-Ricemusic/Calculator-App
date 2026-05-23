import type { CalculatorTheme } from "@features/theme";

export function createGraphCanvasStyles(theme: CalculatorTheme) {
  return {
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
      backgroundColor: theme.colors.screen,
      borderColor: theme.colors.divider,
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
      color: theme.colors.topText,
      fontSize: 22,
      fontWeight: "600",
    },
  } as const;
}
