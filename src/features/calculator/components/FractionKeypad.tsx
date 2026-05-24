import { Pressable, Text, View } from "react-native";

import type { ButtonConfig } from "../types";
import type { FractionField } from "../hooks/useFractionCalculator";
import type { CalculatorStyles } from "../styles/calculatorStyleTypes";

const digits = [
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
];

const fractionDigits = [
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
];

type FractionKeypadProps = {
  activeField: FractionField;
  clearLabel: string;
  onPress: (button: ButtonConfig) => void;
  styles: CalculatorStyles;
};

function FractionPadButton({
  active,
  button,
  clearLabel,
  onPress,
  styles,
  tall,
  wide,
}: {
  active?: boolean;
  button: ButtonConfig;
  clearLabel: string;
  onPress: (button: ButtonConfig) => void;
  styles: CalculatorStyles;
  tall?: boolean;
  wide?: boolean;
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
        active && styles.fractionActiveButton,
        tall && styles.fractionTallButton,
        wide && styles.fractionWideButton,
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

function NumberBlock({
  activeField,
  field,
  onPress,
  styles,
}: {
  activeField: FractionField;
  field: FractionField;
  onPress: (button: ButtonConfig) => void;
  styles: CalculatorStyles;
}) {
  return (
    <View style={styles.fractionNumberBlock}>
      {(field === "whole" ? digits : fractionDigits).map((row) => (
        <View key={`${field}-${row.join("")}`} style={styles.fractionSmallRow}>
          {row.map((digit) => (
            <FractionPadButton
              key={`${field}-${digit}`}
              active={activeField === field}
              button={{ label: digit, field }}
              clearLabel=""
              onPress={onPress}
              styles={styles}
              tall={field === "whole"}
            />
          ))}
        </View>
      ))}
      <View style={styles.fractionSmallRow}>
        <FractionPadButton
          active={activeField === field}
          button={{ label: "0", field }}
          clearLabel=""
          onPress={onPress}
          styles={styles}
          wide
        />
        <FractionPadButton
          active={activeField === field}
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

export function FractionKeypad({ activeField, clearLabel, onPress, styles }: FractionKeypadProps) {
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

      <View style={styles.fractionBody}>
        <NumberBlock activeField={activeField} field="whole" onPress={onPress} styles={styles} />
        <View style={styles.fractionStackedPads}>
          <NumberBlock
            activeField={activeField}
            field="numerator"
            onPress={onPress}
            styles={styles}
          />
          <View style={styles.fractionInputBar} />
          <NumberBlock
            activeField={activeField}
            field="denominator"
            onPress={onPress}
            styles={styles}
          />
        </View>
        <View style={styles.fractionOperatorColumn}>
          <FractionPadButton
            button={{ label: "×", action: "x", variant: "operator" }}
            clearLabel={clearLabel}
            onPress={onPress}
            styles={styles}
            tall
          />
          <FractionPadButton
            button={{ label: "−", action: "-", variant: "operator" }}
            clearLabel={clearLabel}
            onPress={onPress}
            styles={styles}
            tall
          />
          <FractionPadButton
            button={{ label: "+", action: "+", variant: "operator" }}
            clearLabel={clearLabel}
            onPress={onPress}
            styles={styles}
            tall
          />
          <FractionPadButton
            button={{ label: "=", action: "equals", variant: "operator" }}
            clearLabel={clearLabel}
            onPress={onPress}
            styles={styles}
            tall
          />
        </View>
      </View>
    </View>
  );
}
