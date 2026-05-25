import { Pressable, Text, View } from "react-native";
import { useState } from "react";

import type { CalculatorStyles } from "../styles/calculatorStyleTypes";
import { CalculatorHistory } from "./CalculatorHistory";
import { PercentageKeypad } from "./PercentageKeypad";
import { PercentageOptionPicker } from "./PercentageOptionPicker";
import { usePercentageCalculator } from "../hooks/usePercentageCalculator";

type PercentageScreenProps = {
  onOpenMenu: () => void;
  styles: CalculatorStyles;
};

export function PercentageScreen({ onOpenMenu, styles }: PercentageScreenProps) {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const calculator = usePercentageCalculator();

  function selectOption(optionId: Parameters<typeof calculator.selectOption>[0]) {
    calculator.selectOption(optionId);
    setPickerOpen(false);
  }

  return (
    <>
      <View style={styles.percentageTopBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open calculator menu"
          hitSlop={8}
          onPress={onOpenMenu}
          style={styles.iconButton}
        >
          <Text style={styles.iconText}>☰</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Select percentage calculator"
          onPress={() => setPickerOpen(true)}
          style={styles.percentageTitleButton}
        >
          <Text numberOfLines={1} style={styles.percentageTitle}>
            {calculator.option.title}
          </Text>
          <Text style={styles.percentageChevron}>⌄</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open calculator history"
          hitSlop={8}
          onPress={() => setHistoryOpen(true)}
          style={styles.iconButton}
        >
          <Text style={styles.iconText}>◷</Text>
        </Pressable>
      </View>

      <View style={styles.percentageForm}>
        {calculator.option.fields.map((field) => {
          const active = field.id === calculator.activeField;
          const value = calculator.values[field.id] ?? "0";

          return (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Edit ${field.label}`}
              key={field.id}
              onPress={() => calculator.setActiveField(field.id)}
              style={[styles.percentageInputRow, active && styles.percentageInputRowActive]}
            >
              <Text style={styles.percentageInputLabel}>{field.label}</Text>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.55}
                style={styles.percentageInputValue}
              >
                {value}
                {field.suffix}
              </Text>
            </Pressable>
          );
        })}
        <View style={styles.percentageAnswerRow}>
          <Text style={styles.percentageAnswerLabel}>Answer</Text>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.45}
            style={styles.percentageAnswerValue}
          >
            {calculator.result}
            {calculator.option.resultSuffix}
          </Text>
        </View>
      </View>

      <PercentageKeypad onPress={calculator.handlePress} styles={styles} />
      <PercentageOptionPicker
        onClose={() => setPickerOpen(false)}
        onSelect={selectOption}
        selectedOptionId={calculator.option.id}
        styles={styles}
        visible={pickerOpen}
      />
      <CalculatorHistory
        history={calculator.history}
        onClear={calculator.clearHistory}
        onClose={() => setHistoryOpen(false)}
        onLoad={(entry) => {
          calculator.loadHistoryEntry(entry);
          setHistoryOpen(false);
        }}
        styles={styles}
        visible={historyOpen}
      />
    </>
  );
}
