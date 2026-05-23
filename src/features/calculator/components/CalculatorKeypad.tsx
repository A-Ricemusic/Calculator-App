import { View } from 'react-native';

import type { AppStyles } from '../../../app/appTypes';
import type { ButtonConfig, CalculatorMode } from '../types';
import { basicButtons, scientificFnButtons, scientificNumButtons } from '../constants/calculatorButtons';
import { CalculatorButton } from './CalculatorButton';

type CalculatorKeypadProps = {
  clearLabel: string;
  mode: CalculatorMode;
  onPress: (button: ButtonConfig) => void;
  styles: AppStyles;
};

export function CalculatorKeypad({ clearLabel, mode, onPress, styles }: CalculatorKeypadProps) {
  return (
    <>
      {mode === 'scientific' && (
        <View style={styles.sciFnSection}>
          {scientificFnButtons.map((row) => (
            <View key={row.map((button) => button.label).join('-')} style={styles.sciFnRow}>
              {row.map((button) => (
                <CalculatorButton
                  key={button.label}
                  button={button}
                  clearLabel={clearLabel}
                  mode={mode}
                  onPress={onPress}
                  styles={styles}
                  variant="function"
                />
              ))}
            </View>
          ))}
        </View>
      )}

      <View style={[styles.keypad, mode === 'scientific' && styles.scientificKeypad]}>
        {(mode === 'basic' ? basicButtons : scientificNumButtons).map((row) => (
          <View
            key={row.map((button) => button.label).join('-')}
            style={[styles.row, mode === 'scientific' && styles.sciRow]}
          >
            {row.map((button) => (
              <CalculatorButton
                key={button.label}
                button={button}
                clearLabel={clearLabel}
                mode={mode}
                onPress={onPress}
                styles={styles}
                variant="number"
              />
            ))}
          </View>
        ))}
      </View>
    </>
  );
}
