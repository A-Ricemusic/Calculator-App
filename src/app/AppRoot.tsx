import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { Platform, SafeAreaView, StatusBar as NativeStatusBar } from 'react-native';

import { CalculatorTheme, ThemeId, useThemePreference } from '../features/theme';
import { createThemeStyles } from '../features/theme/styles/themeStyles';
import { DrawerMenu } from '../features/menu';
import { createDrawerStyles } from '../features/menu/styles/drawerStyles';
import { createCalculatorStyles } from '../features/calculator/styles/calculatorStyles';
import { createGraphingStyles } from '../features/graphing/styles/graphingStyles';
import { createNotesStyles } from '../features/notes/styles/notesStyles';
import { createLayoutStyles } from '../shared/styles/layoutStyles';
import { AppShell } from './AppShell';
import type { AppMode } from './appModes';

function createStyles(theme: CalculatorTheme) {
  return {
    ...createLayoutStyles(theme),
    ...createCalculatorStyles(theme),
    ...createGraphingStyles(theme),
    ...createNotesStyles(theme),
    ...createDrawerStyles(theme),
    ...createThemeStyles(),
  };
}

export default function AppRoot() {
  const [mode, setMode] = useState<AppMode>('basic');
  const [menuOpen, setMenuOpen] = useState(false);
  const { setThemeId, theme, themeId } = useThemePreference();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const androidTopInset = Platform.OS === 'android' ? NativeStatusBar.currentHeight ?? 0 : 0;

  function selectMode(nextMode: AppMode) {
    setMode(nextMode);
    setMenuOpen(false);
  }

  function selectTheme(nextThemeId: ThemeId) {
    setThemeId(nextThemeId);
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style={theme.statusBar} />
      <AppShell
        mode={mode}
        onOpenMenu={() => setMenuOpen(true)}
        onSelectMode={setMode}
        shellStyle={androidTopInset > 0 ? { paddingTop: androidTopInset } : undefined}
        styles={styles}
        theme={theme}
      />

      {menuOpen && (
        <DrawerMenu
          mode={mode}
          onClose={() => setMenuOpen(false)}
          onSelectMode={selectMode}
          onSelectTheme={selectTheme}
          styles={styles}
          themeId={themeId}
        />
      )}
    </SafeAreaView>
  );
}
