import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import type { AppStyles } from "../../../../app/appTypes";
import type { PlottedEquation } from "../../types";
import { EquationRow } from "./EquationRow";

type EquationListProps = {
  canAddEquation: boolean;
  equations: PlottedEquation[];
  onAdd: () => void;
  onChangeColor: (id: string, color: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onUpdate: (id: string, expression: string) => void;
  styles: AppStyles;
};

export function EquationList({
  canAddEquation,
  equations,
  onAdd,
  onChangeColor,
  onDelete,
  onToggle,
  onUpdate,
  styles,
}: EquationListProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <View style={styles.equationPanel}>
      <View style={styles.equationPanelHeader}>
        <Text style={styles.equationPanelTitle}>Equations</Text>
        <View style={styles.equationPanelActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isCollapsed ? "Show equations" : "Hide equations"}
            accessibilityState={{ expanded: !isCollapsed }}
            onPress={() => setIsCollapsed((current) => !current)}
            style={styles.collapseEquationButton}
          >
            <Text style={styles.collapseEquationText}>{isCollapsed ? "⌄" : "⌃"}</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add equation"
            disabled={!canAddEquation}
            onPress={onAdd}
            style={[styles.addEquationButton, !canAddEquation && styles.addEquationButtonDisabled]}
          >
            <Text style={styles.addEquationText}>+</Text>
          </Pressable>
        </View>
      </View>

      {!isCollapsed && (
        <ScrollView keyboardShouldPersistTaps="handled" style={styles.equationList}>
          {equations.map((equation) => (
            <EquationRow
              equation={equation}
              key={equation.id}
              onChangeColor={onChangeColor}
              onDelete={onDelete}
              onToggle={onToggle}
              onUpdate={onUpdate}
              styles={styles}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
