import { Pressable, Text, TextInput, View } from 'react-native';

import type { AppStyles } from '../../../../app/appTypes';
import type { PlottedEquation } from '../../types';

type EquationRowProps = {
  equation: PlottedEquation;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onUpdate: (id: string, expression: string) => void;
  styles: AppStyles;
};

export function EquationRow({
  equation,
  onDelete,
  onToggle,
  onUpdate,
  styles,
}: EquationRowProps) {
  return (
    <View style={styles.equationRow}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={equation.visible ? 'Hide equation' : 'Show equation'}
        onPress={() => onToggle(equation.id)}
        style={[
          styles.equationColorButton,
          { backgroundColor: equation.color },
          !equation.visible && styles.equationColorDisabled,
        ]}
      >
        <Text style={{ color: '#ffffff', fontWeight: '700' }}>~</Text>
      </Pressable>

      <View style={styles.equationInputWrap}>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="numbers-and-punctuation"
          onChangeText={(text) => onUpdate(equation.id, text)}
          placeholder="y = x^2"
          placeholderTextColor="#8f8f89"
          style={styles.equationInput}
          value={equation.expression}
        />
        {equation.error ? <Text style={styles.equationError}>{equation.error}</Text> : null}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Delete equation"
        onPress={() => onDelete(equation.id)}
        style={styles.deleteEquationButton}
      >
        <Text style={styles.deleteEquationText}>×</Text>
      </Pressable>
    </View>
  );
}
