import type { StyleProp, ViewStyle } from "react-native";
import { Pressable, Text, View } from "react-native";
import { useState } from "react";

import type { CalculatorMode } from "../../../app/appModes";
import type { AppStyles } from "../../../app/appTypes";
import { CalculatorHistory } from "./CalculatorHistory";
import { CalculatorScreen } from "./CalculatorScreen";
import { useCalculator } from "../hooks/useCalculator";

type CalculatorModeViewProps = {
  mode: CalculatorMode;
  onOpenMenu: () => void;
  shellStyle?: StyleProp<ViewStyle>;
  styles: AppStyles;
};

export function CalculatorModeView({
  mode,
  onOpenMenu,
  shellStyle,
  styles,
}: CalculatorModeViewProps) {
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
      </View>

      <CalculatorScreen
        clearLabel={clearLabel}
        display={display}
        handlePress={handlePress}
        mode={mode}
        styles={styles}
      />

      <CalculatorHistory
        history={history}
        onClear={clearHistory}
        onClose={() => setHistoryOpen(false)}
        onLoad={loadHistoryAndClose}
        styles={styles}
        visible={historyOpen}
      />
    </View>
  );
}
