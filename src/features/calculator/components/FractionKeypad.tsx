import { Pressable, Text, View } from "react-native";

import type { ButtonConfig } from "../types";
import type { FractionDisplayMode, FractionField } from "../hooks/useFractionCalculator";
import type { CalculatorStyles } from "../styles/calculatorStyleTypes";

const digits = [
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
];

type FractionKeypadProps = {
  activeField: FractionField;
  clearLabel: string;
  displayMode: FractionDisplayMode;
  onPress: (button: ButtonConfig) => void;
  onSelectField: (field: FractionField) => void;
  styles: CalculatorStyles;
};

function FractionPadButton({
  button,
  clearLabel,
  onPress,
  styles,
}: {
  button: ButtonConfig;
  clearLabel: string;
  onPress: (button: ButtonConfig) => void;
  styles: CalculatorStyles;
}) {
  const label = button.action === "clear" ? clearLabel : button.label;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={button.accessibilityLabel ?? label}
      onPress={() => onPress(button)}
      style={({ pressed }) => [
        styles.fractionButton,
        button.variant === "utility" && styles.buttonUtility,
        button.variant === "operator" && styles.buttonOperator,
        button.wide && styles.fractionWideButton,
        pressed && styles.buttonPressed,
      ]}
    >
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.5}
        style={[
          styles.fractionButtonText,
          button.variant === "operator" && styles.operatorText,
          button.variant === "utility" && styles.utilityText,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function NumberBlock({
  field,
  onPress,
  styles,
}: {
  field: FractionField;
  onPress: (button: ButtonConfig) => void;
  styles: CalculatorStyles;
}) {
  return (
    <View style={styles.fractionNumberBlock}>
      {digits.map((row) => (
        <View key={`${field}-${row.join("")}`} style={styles.fractionSmallRow}>
          {row.map((digit) => (
            <FractionPadButton
              key={`${field}-${digit}`}
              button={{ label: digit, field }}
              clearLabel=""
              onPress={onPress}
              styles={styles}
            />
          ))}
        </View>
      ))}
      <View style={styles.fractionSmallRow}>
        <FractionPadButton
          button={{ label: "0", field, wide: field === "whole" }}
          clearLabel=""
          onPress={onPress}
          styles={styles}
        />
        <FractionPadButton
          button={{
            label: "⌫",
            action: "backspace",
            accessibilityLabel: "Backspace",
            field,
            variant: "utility",
          }}
          clearLabel=""
          onPress={onPress}
          styles={styles}
        />
      </View>
    </View>
  );
}

export function FractionKeypad({
  activeField: _activeField,
  clearLabel,
  displayMode,
  onPress,
  onSelectField: _onSelectField,
  styles,
}: FractionKeypadProps) {
  const formatToggleLabel = displayMode === "mixed" ? "a/b" : "a b/c";
  const formatToggleAccessibilityLabel =
    displayMode === "mixed" ? "Show improper fraction" : "Show mixed number";

  return (
    <View style={styles.fractionKeypad}>
      <View style={styles.fractionTopRow}>
        <FractionPadButton
          button={{ label: "AC", action: "clear", variant: "utility" }}
          clearLabel={clearLabel}
          onPress={onPress}
          styles={styles}
        />
        <FractionPadButton
          button={{
            label: formatToggleLabel,
            action: "toggleFractionFormat",
            accessibilityLabel: formatToggleAccessibilityLabel,
            variant: "utility",
          }}
          clearLabel={clearLabel}
          onPress={onPress}
          styles={styles}
        />
        <FractionPadButton
          button={{ label: "+/−", action: "sign", variant: "utility" }}
          clearLabel={clearLabel}
          onPress={onPress}
          styles={styles}
        />
        <FractionPadButton
          button={{ label: "÷", action: "/", variant: "operator" }}
          clearLabel={clearLabel}
          onPress={onPress}
          styles={styles}
        />
      </View>

      <View style={styles.fractionBody}>
        <NumberBlock field="whole" onPress={onPress} styles={styles} />
        <View style={styles.fractionStackedPads}>
          <NumberBlock field="numerator" onPress={onPress} styles={styles} />
          <View style={styles.fractionInputBar} />
          <NumberBlock field="denominator" onPress={onPress} styles={styles} />
        </View>
        <View style={styles.fractionOperatorColumn}>
          <FractionPadButton
            button={{ label: "×", action: "x", variant: "operator" }}
            clearLabel={clearLabel}
            onPress={onPress}
            styles={styles}
          />
          <FractionPadButton
            button={{ label: "−", action: "-", variant: "operator" }}
            clearLabel={clearLabel}
            onPress={onPress}
            styles={styles}
          />
          <FractionPadButton
            button={{ label: "+", action: "+", variant: "operator" }}
            clearLabel={clearLabel}
            onPress={onPress}
            styles={styles}
          />
          <FractionPadButton
            button={{ label: "=", action: "equals", variant: "operator" }}
            clearLabel={clearLabel}
            onPress={onPress}
            styles={styles}
          />
        </View>
      </View>
    </View>
  );
}
