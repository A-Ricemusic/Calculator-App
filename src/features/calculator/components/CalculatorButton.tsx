import { Pressable, Text, View } from "react-native";

import type { CalculatorStyles } from "../styles/calculatorStyleTypes";
import type { ButtonConfig, CalculatorMode } from "../types";

type CalculatorButtonProps = {
  button: ButtonConfig;
  buttonSize?: number;
  clearLabel: string;
  mode: CalculatorMode;
  onPress: (button: ButtonConfig) => void;
  styles: CalculatorStyles;
  variant: "function" | "number";
};

export function CalculatorButton({
  button,
  buttonSize,
  clearLabel,
  mode,
  onPress,
  styles,
  variant,
}: CalculatorButtonProps) {
  const label = button.action === "clear" ? clearLabel : button.label;
  const accessibilityLabel = button.accessibilityLabel ?? label;
  const isScientificMode = mode === "scientific";

  if (button.spacer) {
    return (
      <View style={[styles.button, isScientificMode && styles.sciNumButton, styles.buttonSpacer]} />
    );
  }

  if (variant === "function") {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={() => onPress(button)}
        style={({ pressed }) => [styles.sciFnButton, pressed && styles.buttonPressed]}
      >
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.6}
          style={styles.sciFnButtonText}
        >
          {label}
        </Text>
      </Pressable>
    );
  }

  const fixedSizeStyle =
    buttonSize && !isScientificMode
      ? { width: buttonSize, height: buttonSize, flex: 0 as const, aspectRatio: undefined }
      : undefined;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={() => onPress(button)}
      style={({ pressed }) => [
        styles.button,
        isScientificMode && styles.sciNumButton,
        button.wide && styles.buttonWide,
        button.variant === "utility" && styles.buttonUtility,
        button.variant === "operator" && styles.buttonOperator,
        pressed && styles.buttonPressed,
        fixedSizeStyle,
      ]}
    >
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.6}
        style={[
          styles.buttonText,
          isScientificMode && styles.sciNumButtonText,
          button.variant === "utility" && styles.utilityText,
          button.variant === "operator" && styles.operatorText,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}
