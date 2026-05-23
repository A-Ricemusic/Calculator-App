import type { StyleProp, ViewStyle } from "react-native";
import { Pressable, Text, View } from "react-native";

import { CalculatorModeView } from "../features/calculator";
import { ConversionScreen } from "../features/conversion";
import { GraphingScreen } from "../features/graphing";
import { MathNotesScreen } from "../features/notes";
import type { CalculatorTheme } from "../features/theme";
import type { AppMode } from "./appModes";
import type { AppStyles } from "./appTypes";

type AppShellProps = {
  mode: AppMode;
  onOpenMenu: () => void;
  onSelectMode: (mode: AppMode) => void;
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
  const isCalculatorMode = mode === "basic" || mode === "scientific";

  if (isCalculatorMode) {
    return (
      <CalculatorModeView
        mode={mode}
        onOpenMenu={onOpenMenu}
        shellStyle={shellStyle}
        styles={styles}
      />
    );
  }

  return (
    <View style={[styles.appShell, shellStyle]}>
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open calculator menu"
            hitSlop={8}
            onPress={onOpenMenu}
            style={styles.iconButton}
          >
            <Text style={styles.iconText}>☰</Text>
          </Pressable>
        </View>
        {mode === "conversion" && <Text style={styles.modeTitle}>Conversion</Text>}
        {mode === "graphing" && <Text style={styles.modeTitle}>Graphing</Text>}
        {mode === "notes" && <Text style={styles.modeTitle}>Math Notes</Text>}
        <View style={styles.iconButton} />
      </View>

      {mode === "graphing" ? (
        <GraphingScreen styles={styles} theme={theme} />
      ) : mode === "notes" ? (
        <MathNotesScreen onSelectMode={onSelectMode} styles={styles} theme={theme} />
      ) : (
        <ConversionScreen styles={styles} />
      )}
    </View>
  );
}
