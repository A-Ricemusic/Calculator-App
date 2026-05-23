import type { StyleProp, ViewStyle } from "react-native";
import { Pressable, Text, View } from "react-native";
import { useState } from "react";

import { CalculatorScreen, useCalculator } from "../features/calculator";
import { CalculatorHistory } from "../features/calculator/components/CalculatorHistory";
import { ConversionScreen } from "../features/conversion";
import { GraphingScreen } from "../features/graphing";
import { MathNotesScreen } from "../features/notes";
import type { CalculatorTheme } from "../features/theme";
import type { AppMode, CalculatorMode } from "./appModes";
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
  const [historyOpen, setHistoryOpen] = useState(false);
  const calculatorMode: CalculatorMode = mode === "scientific" ? "scientific" : "basic";
  const {
    clearHistory,
    clearLabel,
    display,
    handlePress,
    history,
    isRadians,
    loadHistoryEntry,
    resetAll,
  } = useCalculator(calculatorMode);
  const isCalculatorMode = mode === "basic" || mode === "scientific";

  function loadHistoryAndClose(entry: (typeof history)[number]) {
    loadHistoryEntry(entry);
    setHistoryOpen(false);
  }

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
          {mode === "scientific" && (
            <Text style={styles.angleLabel}>{isRadians ? "rad" : "deg"}</Text>
          )}
        </View>
        {mode === "basic" && <Text style={styles.modeTitle}>Calculator</Text>}
        {mode === "conversion" && <Text style={styles.modeTitle}>Conversion</Text>}
        {mode === "graphing" && <Text style={styles.modeTitle}>Graphing</Text>}
        {mode === "notes" && <Text style={styles.modeTitle}>Math Notes</Text>}
        {isCalculatorMode ? (
          <View style={styles.topBarRight}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open calculator history"
              onPress={() => setHistoryOpen(true)}
              style={styles.iconButton}
            >
              <Text style={styles.iconText}>◷</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Reset calculator"
              onPress={resetAll}
              style={styles.iconButton}
            >
              <Text style={styles.iconText}>↺</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.iconButton} />
        )}
      </View>

      {mode === "graphing" ? (
        <GraphingScreen styles={styles} theme={theme} />
      ) : mode === "notes" ? (
        <MathNotesScreen onSelectMode={onSelectMode} styles={styles} theme={theme} />
      ) : mode === "conversion" ? (
        <ConversionScreen styles={styles} />
      ) : (
        <CalculatorScreen
          clearLabel={clearLabel}
          display={display}
          handlePress={handlePress}
          mode={mode}
          styles={styles}
        />
      )}

      {isCalculatorMode && (
        <CalculatorHistory
          history={history}
          onClear={clearHistory}
          onClose={() => setHistoryOpen(false)}
          onLoad={loadHistoryAndClose}
          styles={styles}
          visible={historyOpen}
        />
      )}
    </View>
  );
}
