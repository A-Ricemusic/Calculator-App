import type { CalculatorStyles } from "../styles/calculatorStyleTypes";
import type { ButtonConfig, CalculatorMode } from "../types";
import { CalculatorDisplay } from "./CalculatorDisplay";
import { CalculatorKeypad } from "./CalculatorKeypad";

type CalculatorScreenProps = {
  clearLabel: string;
  display: string;
  handlePress: (button: ButtonConfig) => void;
  isSecondFunction: boolean;
  keypadWidth?: number;
  mode: CalculatorMode;
  styles: CalculatorStyles;
};

export function CalculatorScreen({
  clearLabel,
  display,
  handlePress,
  isSecondFunction,
  keypadWidth,
  mode,
  styles,
}: CalculatorScreenProps) {
  return (
    <>
      <CalculatorDisplay display={display} mode={mode} styles={styles} />
      <CalculatorKeypad
        clearLabel={clearLabel}
        isSecondFunction={isSecondFunction}
        keypadWidth={keypadWidth}
        mode={mode}
        onPress={handlePress}
        styles={styles}
      />
    </>
  );
}
