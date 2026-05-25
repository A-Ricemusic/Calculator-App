import { useMemo } from "react";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { CalculatorScreen, useCalculator } from "@features/calculator";
import { createCalculatorStyles } from "@features/calculator/styles/calculatorStyles";
import type { CalculatorStyles } from "@features/calculator/styles/calculatorStyleTypes";
import type { CalculatorTheme } from "@features/theme";

type MathNotesCalculatorPreviewProps = {
  onClose: () => void;
  theme: CalculatorTheme;
};

const previewHorizontalInset = 48;
const previewMaxWidth = 332;

export function MathNotesCalculatorPreview({ onClose, theme }: MathNotesCalculatorPreviewProps) {
  const calculator = useCalculator("basic");
  const { width } = useWindowDimensions();
  const previewWidth = Math.min(width - previewHorizontalInset, previewMaxWidth);
  const calculatorStyles = useMemo(() => createCalculatorStyles(theme), [theme]);
  const previewCalculatorStyles = useMemo(
    () =>
      ({
        ...calculatorStyles,
        displayPanel: [calculatorStyles.displayPanel, previewStyles.displayPanel],
        display: [calculatorStyles.display, previewStyles.display],
        keypad: [calculatorStyles.keypad, previewStyles.keypad],
        row: [calculatorStyles.row, previewStyles.row],
        button: [calculatorStyles.button, previewStyles.button],
        buttonText: [calculatorStyles.buttonText, previewStyles.buttonText],
      }) as unknown as CalculatorStyles,
    [calculatorStyles],
  );

  return (
    <View
      style={[
        previewStyles.panel,
        {
          backgroundColor: theme.colors.screen,
          borderColor: theme.colors.divider,
          width: previewWidth,
        },
      ]}
    >
      <View style={previewStyles.header}>
        <View style={[previewStyles.handle, { backgroundColor: theme.colors.mutedText }]} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close calculator preview"
          onPress={onClose}
          style={({ pressed }) => [
            previewStyles.closeButton,
            { borderColor: theme.colors.divider },
            pressed && previewStyles.pressed,
          ]}
        >
          <Text style={[previewStyles.closeText, { color: theme.colors.topText }]}>x</Text>
        </Pressable>
      </View>

      <CalculatorScreen
        clearLabel={calculator.clearLabel}
        display={calculator.display}
        handlePress={calculator.handlePress}
        isSecondFunction={calculator.isSecondFunction}
        keypadWidth={previewWidth}
        mode="basic"
        styles={previewCalculatorStyles}
      />
    </View>
  );
}

const previewStyles = StyleSheet.create({
  panel: {
    alignSelf: "center",
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    maxWidth: "100%",
    overflow: "hidden",
    paddingTop: 8,
    position: "absolute",
    top: 72,
    zIndex: 7,
  },
  header: {
    alignItems: "center",
    minHeight: 28,
  },
  handle: {
    borderRadius: 999,
    height: 5,
    opacity: 0.85,
    width: 58,
  },
  closeButton: {
    alignItems: "center",
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    height: 30,
    justifyContent: "center",
    position: "absolute",
    right: 12,
    top: -2,
    width: 30,
  },
  closeText: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 22,
  },
  displayPanel: {
    flexGrow: 0,
    marginHorizontal: 16,
    maxHeight: 86,
    minHeight: 74,
    paddingBottom: 8,
  },
  display: {
    fontSize: 54,
  },
  keypad: {
    gap: 8,
    paddingBottom: 18,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  row: {
    gap: 8,
  },
  button: {
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 30,
    fontWeight: "300",
  },
  pressed: {
    opacity: 0.65,
  },
});
