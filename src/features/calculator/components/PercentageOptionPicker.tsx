import { Modal, Pressable, ScrollView, Text, View } from "react-native";

import type { CalculatorStyles } from "../styles/calculatorStyleTypes";
import type { PercentageOptionId } from "../hooks/usePercentageCalculator";
import { percentageOptions } from "../hooks/usePercentageCalculator";

type PercentageOptionPickerProps = {
  selectedOptionId: PercentageOptionId;
  onClose: () => void;
  onSelect: (optionId: PercentageOptionId) => void;
  styles: CalculatorStyles;
  visible: boolean;
};

export function PercentageOptionPicker({
  selectedOptionId,
  onClose,
  onSelect,
  styles,
  visible,
}: PercentageOptionPickerProps) {
  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.percentagePickerBackdrop}>
        <View style={styles.percentagePickerSheet}>
          <View style={styles.percentagePickerHandle} />
          <View style={styles.percentagePickerHeader}>
            <Text style={styles.percentagePickerTitle}>Select</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close percentage option picker"
              onPress={onClose}
              style={styles.percentagePickerClose}
            >
              <Text style={styles.percentagePickerCloseText}>×</Text>
            </Pressable>
          </View>
          <ScrollView
            contentContainerStyle={styles.percentagePickerList}
            showsVerticalScrollIndicator
          >
            {percentageOptions.map((option) => {
              const selected = option.id === selectedOptionId;

              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${option.title}`}
                  key={option.id}
                  onPress={() => onSelect(option.id)}
                  style={[
                    styles.percentagePickerItem,
                    selected && styles.percentagePickerItemActive,
                  ]}
                >
                  <View style={styles.percentagePickerItemText}>
                    <Text style={styles.percentagePickerItemTitle}>{option.title}</Text>
                    <Text style={styles.percentagePickerItemExample}>{option.example}</Text>
                  </View>
                  {selected && (
                    <View style={styles.percentagePickerCheck}>
                      <Text style={styles.percentagePickerCheckText}>✓</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
