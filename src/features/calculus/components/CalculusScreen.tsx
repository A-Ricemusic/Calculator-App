import { Pressable, Text, View } from "react-native";

import type { CalculatorStyles } from "@features/calculator/styles/calculatorStyleTypes";
import { CalculusKeypad } from "./CalculusKeypad";
import { useCalculusCalculator } from "../hooks/useCalculusCalculator";

type CalculusScreenProps = {
  styles: CalculatorStyles;
};

export function CalculusScreen({ styles }: CalculusScreenProps) {
  const calculator = useCalculusCalculator();
  const expressionField = calculator.fields.find((field) => field.id === "expression");
  const secondaryFields = calculator.fields.filter(
    (field) => field.id !== "expression" && field.id !== "lower" && field.id !== "upper",
  );
  const boundFields = calculator.fields.filter(
    (field) => field.id === "lower" || field.id === "upper",
  );

  function renderField(field: (typeof calculator.fields)[number], compact = false) {
    const active = field.id === calculator.activeField;

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Edit ${field.label}`}
        key={field.id}
        onPress={() => calculator.setActiveField(field.id)}
        style={[
          styles.calculusInputRow,
          compact && styles.calculusBoundInput,
          active && styles.calculusInputRowActive,
        ]}
      >
        <Text style={styles.calculusInputLabel}>{field.label}</Text>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.5}
          style={styles.calculusInputValue}
        >
          {calculator.values[field.id] || "0"}
        </Text>
      </Pressable>
    );
  }

  return (
    <>
      <View style={styles.calculusModeSwitch}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Derivative mode"
          onPress={() => calculator.selectMode("derivative")}
          style={[
            styles.calculusModeButton,
            calculator.mode === "derivative" && styles.calculusModeButtonActive,
          ]}
        >
          <Text
            style={[
              styles.calculusModeText,
              calculator.mode === "derivative" && styles.calculusModeTextActive,
            ]}
          >
            d/dx
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Integral mode"
          onPress={() => calculator.selectMode("integral")}
          style={[
            styles.calculusModeButton,
            calculator.mode === "integral" && styles.calculusModeButtonActive,
          ]}
        >
          <Text
            style={[
              styles.calculusModeText,
              calculator.mode === "integral" && styles.calculusModeTextActive,
            ]}
          >
            ∫
          </Text>
        </Pressable>
      </View>

      <View style={styles.calculusForm}>
        {expressionField ? renderField(expressionField) : null}
        {secondaryFields.map((field) => renderField(field))}
        {boundFields.length > 0 ? (
          <View style={styles.calculusBoundsRow}>
            {boundFields.map((field) => renderField(field, true))}
          </View>
        ) : null}
        <View style={styles.calculusAnswerRow}>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.45}
            style={styles.calculusAnswerValue}
          >
            {calculator.symbolicResult}
          </Text>
        </View>
        <View style={styles.calculusAnswerRow}>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.45}
            style={styles.calculusAnswerValue}
          >
            {calculator.result}
          </Text>
        </View>
      </View>

      <CalculusKeypad onPress={calculator.handlePress} styles={styles} />
    </>
  );
}
