import type { StyleProp, ViewStyle } from 'react-native';
import { Pressable, Text, View } from 'react-native';

import { CalculatorScreen, useCalculator, type Mode } from '../features/calculator';
import { NotesScreen } from '../features/notes';
import type { CalculatorTheme } from '../features/theme';
import type { AppStyles } from './appTypes';

type AppShellProps = {
  mode: Mode;
  onOpenMenu: () => void;
  onSelectMode: (mode: Mode) => void;
  shellStyle?: StyleProp<ViewStyle>;
  styles: AppStyles;
  theme: CalculatorTheme;
};

export function AppShell({
  mode,
  onOpenMenu,
  onSelectMode,
  shellStyle,
  styles,
  theme,
}: AppShellProps) {
  const { clearLabel, display, handlePress, resetAll } = useCalculator(mode);

  return (
    <View style={[styles.appShell, shellStyle]}>
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open calculator menu"
            onPress={onOpenMenu}
            style={styles.iconButton}
          >
            <Text style={styles.iconText}>☰</Text>
          </Pressable>
          {mode === 'scientific' && <Text style={styles.angleLabel}>rad</Text>}
        </View>
        {mode === 'basic' && <Text style={styles.modeTitle}>Calculator</Text>}
        {mode === 'notes' && <Text style={styles.modeTitle}>Math Notes</Text>}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Reset calculator"
          onPress={resetAll}
          style={styles.iconButton}
        >
          <Text style={styles.iconText}>↺</Text>
        </Pressable>
      </View>

      {mode === 'notes' ? (
        <NotesScreen onSelectMode={onSelectMode} styles={styles} theme={theme} />
      ) : (
        <CalculatorScreen
          clearLabel={clearLabel}
          display={display}
          handlePress={handlePress}
          mode={mode}
          styles={styles}
        />
      )}
    </View>
  );
}
