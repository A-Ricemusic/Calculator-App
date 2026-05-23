import { Pressable, Text, View } from "react-native";

import type { AppStyles } from "../../../app/appTypes";
import type { ButtonConfig, CalculatorMode } from "../types";

type CalculatorButtonProps = {
  button: ButtonConfig;
  clearLabel: string;
  mode: CalculatorMode;
  onPress: (button: ButtonConfig) => void;
  styles: AppStyles;
  variant: "function" | "number";
};

export function CalculatorButton({
  button,
  clearLabel,
  mode,
  onPress,
  styles,
  variant,
}: CalculatorButtonProps) {
  const label = button.action === "clear" ? clearLabel : button.label;
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
        accessibilityLabel={label}
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

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => onPress(button)}
      style={({ pressed }) => [
        styles.button,
        isScientificMode && styles.sciNumButton,
        button.wide && styles.buttonWide,
        button.variant === "utility" && styles.buttonUtility,
        button.variant === "operator" && styles.buttonOperator,
        pressed && styles.buttonPressed,
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
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}
