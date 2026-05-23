import { Text, View } from 'react-native';

import type { AppStyles } from '../../../app/appTypes';
import type { Mode } from '../types';

type CalculatorDisplayProps = {
  display: string;
  mode: Mode;
  styles: AppStyles;
};

export function CalculatorDisplay({ display, mode, styles }: CalculatorDisplayProps) {
  return (
    <View style={[styles.displayPanel, mode === 'scientific' && styles.scientificDisplay]}>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={[styles.display, mode === 'scientific' && styles.scientificDisplayText]}
      >
        {display}
      </Text>
    </View>
  );
}

