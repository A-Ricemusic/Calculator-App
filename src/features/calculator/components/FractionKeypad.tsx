import { Pressable, Text, useWindowDimensions, View } from "react-native";

import type { ButtonConfig } from "../types";
import type { FractionDisplayMode, FractionField } from "../hooks/useFractionCalculator";
import type { CalculatorStyles } from "../styles/calculatorStyleTypes";

const digits = [
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
];

const BODY_COLUMNS = 7;
const KEYPAD_PADDING_H = 20;
const BODY_GAP = 6;
const SMALL_BUTTON_GAP = 4;
const MIN_BUTTON_SIZE = 42;
const MAX_BUTTON_SIZE = 72;

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
  buttonSize,
  clearLabel,
  onPress,
  styles,
}: {
  button: ButtonConfig;
  buttonSize?: number;
  clearLabel: string;
  onPress: (button: ButtonConfig) => void;
  styles: CalculatorStyles;
}) {
  const label = button.action === "clear" ? clearLabel : button.label;
  const fixedSizeStyle = buttonSize
    ? {
        flex: 0 as const,
        height: buttonSize,
        width: button.wide ? buttonSize * 2 + SMALL_BUTTON_GAP : buttonSize,
      }
    : undefined;

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
        fixedSizeStyle,
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
  buttonSize,
  field,
  onPress,
  styles,
}: {
  buttonSize: number;
  field: FractionField;
  onPress: (button: ButtonConfig) => void;
  styles: CalculatorStyles;
}) {
  const blockWidth = buttonSize * 3 + SMALL_BUTTON_GAP * 2;

  return (
    <View style={[styles.fractionNumberBlock, { width: blockWidth }]}>
      {digits.map((row) => (
        <View key={`${field}-${row.join("")}`} style={styles.fractionSmallRow}>
          {row.map((digit) => (
            <FractionPadButton
              key={`${field}-${digit}`}
              button={{ label: digit, field }}
              buttonSize={buttonSize}
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
          buttonSize={buttonSize}
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
          buttonSize={buttonSize}
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
  const { width } = useWindowDimensions();
  const formatToggleLabel = displayMode === "mixed" ? "a/b" : "a b/c";
  const formatToggleAccessibilityLabel =
    displayMode === "mixed" ? "Show improper fraction" : "Show mixed number";
  const buttonSize = Math.max(
    MIN_BUTTON_SIZE,
    Math.min(
      MAX_BUTTON_SIZE,
      Math.floor((width - KEYPAD_PADDING_H - BODY_GAP * 2 - SMALL_BUTTON_GAP * 4) / BODY_COLUMNS),
    ),
  );

  return (
    <View style={styles.fractionKeypad}>
      <View style={styles.fractionTopRow}>
        <FractionPadButton
          button={{ label: "AC", action: "clear", variant: "utility" }}
          buttonSize={buttonSize}
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
          buttonSize={buttonSize}
          clearLabel={clearLabel}
          onPress={onPress}
          styles={styles}
        />
        <FractionPadButton
          button={{ label: "+/−", action: "sign", variant: "utility" }}
          buttonSize={buttonSize}
          clearLabel={clearLabel}
          onPress={onPress}
          styles={styles}
        />
        <FractionPadButton
          button={{ label: "÷", action: "/", variant: "operator" }}
          buttonSize={buttonSize}
          clearLabel={clearLabel}
          onPress={onPress}
          styles={styles}
        />
      </View>

      <View style={styles.fractionBody}>
        <NumberBlock buttonSize={buttonSize} field="whole" onPress={onPress} styles={styles} />
        <View style={styles.fractionStackedPads}>
          <NumberBlock
            buttonSize={buttonSize}
            field="numerator"
            onPress={onPress}
            styles={styles}
          />
          <View style={styles.fractionInputBar} />
          <NumberBlock
            buttonSize={buttonSize}
            field="denominator"
            onPress={onPress}
            styles={styles}
          />
        </View>
        <View style={styles.fractionOperatorColumn}>
          <FractionPadButton
            button={{ label: "×", action: "x", variant: "operator" }}
            buttonSize={buttonSize}
            clearLabel={clearLabel}
            onPress={onPress}
            styles={styles}
          />
          <FractionPadButton
            button={{ label: "−", action: "-", variant: "operator" }}
            buttonSize={buttonSize}
            clearLabel={clearLabel}
            onPress={onPress}
            styles={styles}
          />
          <FractionPadButton
            button={{ label: "+", action: "+", variant: "operator" }}
            buttonSize={buttonSize}
            clearLabel={clearLabel}
            onPress={onPress}
            styles={styles}
          />
          <FractionPadButton
            button={{ label: "=", action: "equals", variant: "operator" }}
            buttonSize={buttonSize}
            clearLabel={clearLabel}
            onPress={onPress}
            styles={styles}
          />
        </View>
      </View>
    </View>
  );
}
