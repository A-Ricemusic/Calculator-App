import { View } from "react-native";

import type { CalculatorStyles } from "../styles/calculatorStyleTypes";
import type { ButtonConfig } from "../types";
import { CalculatorButton } from "./CalculatorButton";

const percentageButtons: ButtonConfig[][] = [
  [
    { label: "C", action: "clear", variant: "utility" },
    { label: "+/−", action: "sign", variant: "utility" },
    { label: "%", variant: "utility" },
    { label: "÷", variant: "operator" },
  ],
  [{ label: "7" }, { label: "8" }, { label: "9" }, { label: "×", variant: "operator" }],
  [{ label: "4" }, { label: "5" }, { label: "6" }, { label: "−", variant: "operator" }],
  [{ label: "1" }, { label: "2" }, { label: "3" }, { label: "+", variant: "operator" }],
  [
    { label: "0" },
    { label: "." },
    { label: "⌫", action: "backspace", accessibilityLabel: "Backspace", variant: "utility" },
    { label: "=", action: "equals", variant: "operator" },
  ],
];

type PercentageKeypadProps = {
  onPress: (button: ButtonConfig) => void;
  styles: CalculatorStyles;
};

export function PercentageKeypad({ onPress, styles }: PercentageKeypadProps) {
  return (
    <View style={styles.percentageKeypad}>
      {percentageButtons.map((row) => (
        <View key={row.map((button) => button.label).join("-")} style={styles.percentageKeypadRow}>
          {row.map((button) => (
            <CalculatorButton
              key={button.label}
              button={button}
              clearLabel="C"
              mode="percentage"
              onPress={onPress}
              styles={styles}
              variant="number"
            />
          ))}
        </View>
      ))}
    </View>
  );
}
