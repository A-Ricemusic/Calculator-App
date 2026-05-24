import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import { Platform, StatusBar as NativeStatusBar, View } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemeId, useThemePreference } from "../features/theme";
import { DrawerMenu } from "../features/menu";
import { AppShell } from "./AppShell";
import type { AppMode } from "./appModes";
import { createAppStyles } from "./appStyles";

function AppContent() {
  const [mode, setMode] = useState<AppMode>("basic");
  const [menuOpen, setMenuOpen] = useState(false);
  const { setThemeId, theme, themeId } = useThemePreference();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createAppStyles(theme), [theme]);
  const androidTopInset = Platform.OS === "android" ? (NativeStatusBar.currentHeight ?? 0) : 0;
  const topInset = Math.max(insets.top, androidTopInset);

  function selectMode(nextMode: AppMode) {
    setMode(nextMode);
    setMenuOpen(false);
  }

  function selectTheme(nextThemeId: ThemeId) {
    setThemeId(nextThemeId);
  }

  return (
    <View style={styles.screen}>
      <StatusBar style={theme.statusBar} />
      <AppShell
        mode={mode}
        onOpenMenu={() => setMenuOpen(true)}
        onSelectMode={setMode}
        shellStyle={topInset > 0 ? { paddingTop: topInset } : undefined}
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
    </View>
  );
}

export default function AppRoot() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}
