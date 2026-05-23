import { Pressable, ScrollView, Text, View } from "react-native";

import type { AppStyles } from "../../../../app/appTypes";
import { MAX_GRAPH_EQUATIONS } from "../constants/graphColors";
import type { PlottedEquation } from "../../types";
import { EquationRow } from "./EquationRow";

type EquationListProps = {
  canAddEquation: boolean;
  equations: PlottedEquation[];
  onAdd: () => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onUpdate: (id: string, expression: string) => void;
  styles: AppStyles;
};

export function EquationList({
  canAddEquation,
  equations,
  onAdd,
  onDelete,
  onToggle,
  onUpdate,
  styles,
}: EquationListProps) {
  return (
    <View style={styles.equationPanel}>
      <View style={styles.equationPanelHeader}>
        <Text style={styles.equationPanelTitle}>
          Equations {equations.length}/{MAX_GRAPH_EQUATIONS}
        </Text>
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

      <ScrollView keyboardShouldPersistTaps="handled" style={styles.equationList}>
        {equations.map((equation) => (
          <EquationRow
            equation={equation}
            key={equation.id}
            onDelete={onDelete}
            onToggle={onToggle}
            onUpdate={onUpdate}
            styles={styles}
          />
        ))}
      </ScrollView>
    </View>
  );
}
