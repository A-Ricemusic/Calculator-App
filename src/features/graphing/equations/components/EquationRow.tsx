import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import type { AppStyles } from "@shared/styles/appTypes";
import type { PlottedEquation } from "../../types";
import { GRAPH_COLORS } from "../constants/graphColors";

type EquationRowProps = {
  equation: PlottedEquation;
  onChangeColor: (id: string, color: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onUpdate: (id: string, expression: string) => void;
  styles: AppStyles;
};

export function EquationRow({
  equation,
  onChangeColor,
  onDelete,
  onToggle,
  onUpdate,
  styles,
}: EquationRowProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <View>
      <View style={styles.equationRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Change line color"
          accessibilityHint="Long press to toggle visibility"
          onPress={() => setPickerOpen((open) => !open)}
          onLongPress={() => onToggle(equation.id)}
          style={[
            styles.equationColorButton,
            { backgroundColor: equation.color },
            !equation.visible && styles.equationColorDisabled,
          ]}
        >
          <Text style={{ color: "#ffffff", fontWeight: "700" }}>
            {equation.visible ? "~" : "—"}
          </Text>
        </Pressable>

        <View style={styles.equationInputWrap}>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="numbers-and-punctuation"
            onChangeText={(text) => onUpdate(equation.id, text)}
            placeholder="y = x^2"
            placeholderTextColor="#8f8f89"
            style={styles.equationInput}
            value={equation.expression}
          />
          {equation.error ? <Text style={styles.equationError}>{equation.error}</Text> : null}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Delete equation"
          onPress={() => onDelete(equation.id)}
          style={styles.deleteEquationButton}
        >
          <Text style={styles.deleteEquationText}>×</Text>
        </Pressable>
      </View>

      {pickerOpen && (
        <View style={styles.colorPickerRow}>
          {GRAPH_COLORS.map((color) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Select color ${color}`}
              key={color}
              onPress={() => {
                onChangeColor(equation.id, color);
                setPickerOpen(false);
              }}
              style={[
                styles.colorPickerSwatch,
                {
                  backgroundColor: color,
                  borderColor: color === equation.color ? "#ffffff" : color,
                },
              ]}
            >
              {color === equation.color && <Text style={styles.colorPickerCheck}>✓</Text>}
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
