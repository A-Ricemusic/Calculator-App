import type { StyleProp, ViewStyle } from "react-native";
import { Pressable, Text, View } from "react-native";
import { useState } from "react";

import type { CalculatorMode } from "@app/appModes";
import type { CalculatorStyles } from "../styles/calculatorStyleTypes";
import { CalculatorHistory } from "./CalculatorHistory";
import { CalculatorScreen } from "./CalculatorScreen";
import { FractionDisplay } from "./FractionDisplay";
import { FractionKeypad } from "./FractionKeypad";
import { useCalculator } from "../hooks/useCalculator";
import { useFractionCalculator } from "../hooks/useFractionCalculator";

type CalculatorModeViewProps = {
  mode: CalculatorMode;
  onOpenMenu: () => void;
  shellStyle?: StyleProp<ViewStyle>;
  styles: CalculatorStyles;
};

export function CalculatorModeView({
  mode,
  onOpenMenu,
  shellStyle,
  styles,
}: CalculatorModeViewProps) {
  const [historyOpen, setHistoryOpen] = useState(false);
  const calculatorMode: CalculatorMode = mode === "scientific" ? "scientific" : "basic";
  const fractionCalculator = useFractionCalculator();
  const {
    clearHistory,
    clearLabel,
    display,
    handlePress,
    history,
    isRadians,
    isSecondFunction,
    loadHistoryEntry,
    resetAll,
  } = useCalculator(calculatorMode);

  if (mode === "fraction") {
    function loadFractionHistoryAndClose(entry: (typeof fractionCalculator.history)[number]) {
      fractionCalculator.loadHistoryEntry(entry);
      setHistoryOpen(false);
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
          <Text style={styles.modeTitle}>Fractions</Text>
          <View style={styles.topBarRight}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open calculator history"
              hitSlop={8}
              onPress={() => setHistoryOpen(true)}
              style={styles.iconButton}
            >
              <Text style={styles.iconText}>◷</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Reset calculator"
              hitSlop={8}
              onPress={fractionCalculator.resetAll}
              style={styles.iconButton}
            >
              <Text style={styles.iconText}>↺</Text>
            </Pressable>
          </View>
        </View>

        <FractionDisplay
          currentValue={fractionCalculator.currentValue}
          operator={fractionCalculator.operator}
          parts={fractionCalculator.parts}
          storedValue={fractionCalculator.storedValue}
          waitingForOperand={fractionCalculator.waitingForOperand}
          styles={styles}
        />
        <FractionKeypad
          activeField={fractionCalculator.activeField}
          clearLabel={fractionCalculator.clearLabel}
          onPress={fractionCalculator.handlePress}
          onSelectField={fractionCalculator.setActiveField}
          styles={styles}
        />

        <CalculatorHistory
          history={fractionCalculator.history}
          onClear={fractionCalculator.clearHistory}
          onClose={() => setHistoryOpen(false)}
          onLoad={loadFractionHistoryAndClose}
          styles={styles}
          visible={historyOpen}
        />
      </View>
    );
  }

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
            hitSlop={8}
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
            hitSlop={8}
            onPress={() => setHistoryOpen(true)}
            style={styles.iconButton}
          >
            <Text style={styles.iconText}>◷</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Reset calculator"
            hitSlop={8}
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
        isSecondFunction={isSecondFunction}
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
