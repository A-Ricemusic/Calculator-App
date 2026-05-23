import type { StyleProp, ViewStyle } from 'react-native';
import { Pressable, Text, View } from 'react-native';

import { CalculatorScreen, useCalculator, type Mode } from '../features/calculator';
import { GraphingScreen } from '../features/graphing';
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
  const calculatorMode = mode === 'scientific' ? 'scientific' : 'basic';
  const { clearLabel, display, handlePress, resetAll } = useCalculator(calculatorMode);

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
        {mode === 'graphing' && <Text style={styles.modeTitle}>Graphing</Text>}
        {mode === 'notes' && <Text style={styles.modeTitle}>Math Notes</Text>}
        {mode === 'basic' || mode === 'scientific' ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Reset calculator"
            onPress={resetAll}
            style={styles.iconButton}
          >
            <Text style={styles.iconText}>↺</Text>
          </Pressable>
        ) : (
          <View style={styles.iconButton} />
        )}
      </View>

      {mode === 'graphing' ? (
        <GraphingScreen styles={styles} theme={theme} />
      ) : mode === 'notes' ? (
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
