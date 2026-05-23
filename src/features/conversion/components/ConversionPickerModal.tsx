import { Modal, Pressable, ScrollView, Text, View } from "react-native";

import type { ConversionStyles } from "../styles/conversionStyleTypes";
import { conversionCategories } from "../constants/conversionCategories";
import type { ConversionCategory } from "../types";
import type { ConversionPickerTarget } from "../hooks/useConversion";

type ConversionPickerModalProps = {
  activeCategory: ConversionCategory;
  activeFromUnitId: string;
  activeToUnitId: string;
  onClose: () => void;
  onSelectCategory: (category: ConversionCategory) => void;
  onSelectUnit: (id: string) => void;
  pickerTarget: ConversionPickerTarget | null;
  styles: ConversionStyles;
};

function getPickerTitle(pickerTarget: ConversionPickerTarget | null) {
  if (pickerTarget === "category") {
    return "Select Category";
  }

  return pickerTarget === "fromUnit" ? "Convert From" : "Convert To";
}

export function ConversionPickerModal({
  activeCategory,
  activeFromUnitId,
  activeToUnitId,
  onClose,
  onSelectCategory,
  onSelectUnit,
  pickerTarget,
  styles,
}: ConversionPickerModalProps) {
  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
      transparent={false}
      visible={pickerTarget !== null}
    >
      <View style={styles.conversionPickerContainer}>
        <View style={styles.conversionPickerHeader}>
          <Text style={styles.conversionPickerTitle}>{getPickerTitle(pickerTarget)}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            style={styles.conversionPickerDone}
          >
            <Text style={styles.conversionPickerDoneText}>Done</Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.conversionPickerList}
          showsVerticalScrollIndicator={false}
        >
          {pickerTarget === "category"
            ? conversionCategories.map((item) => {
                const active = item.id === activeCategory.id;
                return (
                  <Pressable
                    key={item.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    onPress={() => onSelectCategory(item)}
                    style={[
                      styles.conversionPickerItem,
                      active && styles.conversionPickerItemActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.conversionPickerItemText,
                        active && styles.conversionPickerItemTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                    {active && <Text style={styles.conversionPickerCheck}>✓</Text>}
                  </Pressable>
                );
              })
            : activeCategory.units.map((unit) => {
                const activeId = pickerTarget === "fromUnit" ? activeFromUnitId : activeToUnitId;
                const active = unit.id === activeId;
                return (
                  <Pressable
                    key={unit.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    onPress={() => onSelectUnit(unit.id)}
                    style={[
                      styles.conversionPickerItem,
                      active && styles.conversionPickerItemActive,
                    ]}
                  >
                    <View style={styles.conversionPickerItemRow}>
                      <Text
                        style={[
                          styles.conversionPickerItemText,
                          active && styles.conversionPickerItemTextActive,
                        ]}
                      >
                        {unit.label}
                      </Text>
                      <Text
                        style={[
                          styles.conversionPickerItemSymbol,
                          active && styles.conversionPickerItemTextActive,
                        ]}
                      >
                        {unit.symbol}
                      </Text>
                    </View>
                    {active && <Text style={styles.conversionPickerCheck}>✓</Text>}
                  </Pressable>
                );
              })}
        </ScrollView>
      </View>
    </Modal>
  );
}
