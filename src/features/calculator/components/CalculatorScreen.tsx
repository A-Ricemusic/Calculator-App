import type { AppStyles } from "@shared/styles/appTypes";
import type { ButtonConfig, CalculatorMode } from "../types";
import { CalculatorDisplay } from "./CalculatorDisplay";
import { CalculatorKeypad } from "./CalculatorKeypad";

type CalculatorScreenProps = {
  clearLabel: string;
  display: string;
  handlePress: (button: ButtonConfig) => void;
  mode: CalculatorMode;
  styles: AppStyles;
};

export function CalculatorScreen({
  clearLabel,
  display,
  handlePress,
  mode,
  styles,
}: CalculatorScreenProps) {
  return (
    <>
      <CalculatorDisplay display={display} mode={mode} styles={styles} />
      <CalculatorKeypad clearLabel={clearLabel} mode={mode} onPress={handlePress} styles={styles} />
    </>
  );
}
