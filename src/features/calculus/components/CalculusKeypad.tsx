import { Pressable, Text, View } from "react-native";

import type { ButtonConfig } from "@features/calculator/types";
import type { CalculatorStyles } from "@features/calculator/styles/calculatorStyleTypes";

const calculusButtons: ButtonConfig[][] = [
  [
    { label: "C", action: "clear", variant: "utility" },
    { label: "⌫", action: "backspace", accessibilityLabel: "Backspace", variant: "utility" },
    { label: "next", action: "next", variant: "utility" },
    { label: "÷", action: "/", variant: "operator" },
  ],
  [
    { label: "sin", action: "sin(" },
    { label: "cos", action: "cos(" },
    { label: "ln", action: "ln(" },
    { label: "√", action: "sqrt(" },
    { label: "(" },
    { label: ")" },
  ],
  [
    { label: "7" },
    { label: "8" },
    { label: "9" },
    { label: "×", action: "*", variant: "operator" },
  ],
  [
    { label: "4" },
    { label: "5" },
    { label: "6" },
    { label: "−", action: "-", variant: "operator" },
  ],
  [{ label: "1" }, { label: "2" }, { label: "3" }, { label: "+", variant: "operator" }],
  [{ label: "0" }, { label: "." }, { label: "x" }, { label: "^" }, { label: "π", action: "PI" }],
];

type CalculusKeypadProps = {
  onPress: (button: ButtonConfig) => void;
  styles: CalculatorStyles;
};

export function CalculusKeypad({ onPress, styles }: CalculusKeypadProps) {
  return (
    <View style={styles.calculusKeypad}>
      {calculusButtons.map((row) => (
        <View key={row.map((button) => button.label).join("-")} style={styles.calculusKeypadRow}>
          {row.map((button) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={button.accessibilityLabel ?? button.label}
              key={button.label}
              onPress={() => onPress(button)}
              style={({ pressed }) => [
                styles.calculusButton,
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
                  styles.calculusButtonText,
                  button.variant === "utility" && styles.utilityText,
                  button.variant === "operator" && styles.operatorText,
                ]}
              >
                {button.label}
              </Text>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
}
