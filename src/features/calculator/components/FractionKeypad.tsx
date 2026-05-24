import { Pressable, Text, View } from "react-native";

import type { ButtonConfig } from "../types";
import type { FractionField } from "../hooks/useFractionCalculator";
import type { CalculatorStyles } from "../styles/calculatorStyleTypes";

const fieldTabs: { field: FractionField; label: string }[] = [
  { field: "whole", label: "Whole" },
  { field: "numerator", label: "Num" },
  { field: "denominator", label: "Den" },
];

const keypadRows: ButtonConfig[][] = [
  [
    { label: "7" },
    { label: "8" },
    { label: "9" },
    { label: "×", action: "x", variant: "operator" },
  ],
  [
    { label: "4" },
    { label: "5" },
    { label: "6" },
    { label: "−", action: "-", variant: "operator" },
  ],
  [
    { label: "1" },
    { label: "2" },
    { label: "3" },
    { label: "+", action: "+", variant: "operator" },
  ],
];

const bottomRow: ButtonConfig[] = [
  { label: "0", wide: true },
  { label: "⌫", action: "backspace", accessibilityLabel: "Backspace", variant: "utility" },
  { label: "=", action: "equals", variant: "operator" },
];

type FractionKeypadProps = {
  activeField: FractionField;
  clearLabel: string;
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
        minimumFontScale={0.55}
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

export function FractionKeypad({
  activeField,
  clearLabel,
  onPress,
  onSelectField,
  styles,
}: FractionKeypadProps) {
  return (
    <View style={styles.fractionKeypad}>
      <View style={styles.fractionRow}>
        <FractionPadButton
          button={{ label: "AC", action: "clear", variant: "utility" }}
          clearLabel={clearLabel}
          onPress={onPress}
          styles={styles}
        />
        <FractionPadButton
          button={{ label: "▣", accessibilityLabel: "Fraction mode", variant: "utility" }}
          clearLabel={clearLabel}
          onPress={() => undefined}
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

      <View style={styles.fractionFieldRow}>
        {fieldTabs.map(({ field, label }) => (
          <Pressable
            key={field}
            accessibilityRole="button"
            accessibilityLabel={`Edit ${label.toLowerCase()}`}
            onPress={() => onSelectField(field)}
            style={[
              styles.fractionFieldTab,
              activeField === field && styles.fractionFieldTabActive,
            ]}
          >
            <Text
              style={[
                styles.fractionFieldTabText,
                activeField === field && styles.fractionFieldTabTextActive,
              ]}
            >
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

      {keypadRows.map((row) => (
        <View key={row.map((b) => b.label).join("-")} style={styles.fractionRow}>
          {row.map((button) => (
            <FractionPadButton
              key={button.label}
              button={button}
              clearLabel={clearLabel}
              onPress={onPress}
              styles={styles}
            />
          ))}
        </View>
      ))}

      <View style={styles.fractionRow}>
        {bottomRow.map((button) => (
          <FractionPadButton
            key={button.label}
            button={button}
            clearLabel={clearLabel}
            onPress={onPress}
            styles={styles}
          />
        ))}
      </View>
    </View>
  );
}
