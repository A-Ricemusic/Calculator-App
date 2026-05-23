import { Pressable, View } from 'react-native';

import type { AppStyles } from '../../../../app/appTypes';
import { utensilColors } from '../../drawing/constants/drawingTools';

type NotesColorPickerProps = {
  activeColor: string;
  onClose: () => void;
  onSelectColor: (color: string) => void;
  styles: AppStyles;
};

export function NotesColorPicker({ activeColor, onClose, onSelectColor, styles }: NotesColorPickerProps) {
  return (
    <View style={styles.colorPickerOverlay}>
      <Pressable style={styles.colorPickerScrim} onPress={onClose} />
      <View style={styles.colorPickerPanel}>
        {utensilColors.map((color) => (
          <Pressable
            key={color}
            accessibilityRole="button"
            accessibilityLabel={`Set color ${color}`}
            onPress={() => onSelectColor(color)}
            style={[
              styles.colorPickerDot,
              { backgroundColor: color },
              activeColor === color && styles.colorPickerDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}
