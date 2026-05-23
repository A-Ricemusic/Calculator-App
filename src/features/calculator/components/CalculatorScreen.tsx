import type { AppStyles } from '../../../app/appTypes';
import type { ButtonConfig, Mode } from '../types';
import { CalculatorDisplay } from './CalculatorDisplay';
import { CalculatorKeypad } from './CalculatorKeypad';

type CalculatorScreenProps = {
  clearLabel: string;
  display: string;
  handlePress: (button: ButtonConfig) => void;
  mode: Mode;
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
      <CalculatorKeypad
        clearLabel={clearLabel}
        mode={mode}
        onPress={handlePress}
        styles={styles}
      />
    </>
  );
}
