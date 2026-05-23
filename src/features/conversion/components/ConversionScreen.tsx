import { useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";

import type { AppStyles } from "../../../app/appTypes";
import { conversionCategories } from "../constants/conversionCategories";
import type { ConversionCategory } from "../types";
import {
  convertValue,
  findUnit,
  formatConversionValue,
  parseConversionInput,
} from "../utils/conversionMath";

const initialCategory = conversionCategories[0];

function getDefaultFromUnitId(category: ConversionCategory) {
  return category.units.find((unit) => unit.id === category.baseUnitId)?.id ?? category.units[0].id;
}

function getDefaultToUnitId(category: ConversionCategory) {
  return (
    category.units.find((unit) => unit.id !== getDefaultFromUnitId(category))?.id ??
    category.units[0].id
  );
}

type PickerTarget = "category" | "fromUnit" | "toUnit" | null;

type ConversionScreenProps = {
  styles: AppStyles;
};

export function ConversionScreen({ styles }: ConversionScreenProps) {
  const [categoryId, setCategoryId] = useState(initialCategory.id);
  const [fromUnitId, setFromUnitId] = useState(getDefaultFromUnitId(initialCategory));
  const [toUnitId, setToUnitId] = useState("foot");
  const [inputValue, setInputValue] = useState("1");
  const [pickerTarget, setPickerTarget] = useState<PickerTarget>(null);

  const category = useMemo(
    () => conversionCategories.find((item) => item.id === categoryId) ?? initialCategory,
    [categoryId],
  );
  const fromUnit = findUnit(category, fromUnitId);
  const toUnit = findUnit(category, toUnitId);
  const parsedInput = parseConversionInput(inputValue);
  const convertedValue =
    parsedInput === null ? "" : formatConversionValue(convertValue(parsedInput, fromUnit, toUnit));

  function selectCategory(nextCategory: ConversionCategory) {
    setCategoryId(nextCategory.id);
    setFromUnitId(getDefaultFromUnitId(nextCategory));
    setToUnitId(getDefaultToUnitId(nextCategory));
    setPickerTarget(null);
  }

  function swapUnits() {
    setFromUnitId(toUnitId);
    setToUnitId(fromUnitId);
  }

  function handlePickerSelect(id: string) {
    if (pickerTarget === "fromUnit") {
      setFromUnitId(id);
    } else if (pickerTarget === "toUnit") {
      setToUnitId(id);
    }
    setPickerTarget(null);
  }

  return (
    <View style={styles.conversionScreen}>
      {/* Category Selector */}
      <Pressable
        accessibilityRole="button"
        onPress={() => setPickerTarget("category")}
        style={styles.conversionCategorySelector}
      >
        <Text style={styles.conversionCategorySelectorText}>{category.label}</Text>
        <Text style={styles.conversionChevron}>▾</Text>
      </Pressable>

      {/* Conversion Card */}
      <View style={styles.conversionCard}>
        {/* From Section */}
        <Pressable
          accessibilityRole="button"
          onPress={() => setPickerTarget("fromUnit")}
          style={styles.conversionUnitSelector}
        >
          <Text style={styles.conversionUnitLabel}>{fromUnit.label}</Text>
          <Text style={styles.conversionUnitSymbol}>{fromUnit.symbol} ▾</Text>
        </Pressable>

        <TextInput
          accessibilityLabel="Conversion input value"
          inputMode="decimal"
          keyboardType="numeric"
          onChangeText={setInputValue}
          placeholder="0"
          placeholderTextColor={styles.conversionPlaceholder?.color as string}
          selectTextOnFocus
          style={styles.conversionInput}
          value={inputValue}
        />

        {/* Swap Divider */}
        <View style={styles.conversionDividerRow}>
          <View style={styles.conversionDividerLine} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Swap conversion units"
            onPress={swapUnits}
            style={styles.conversionSwapButton}
          >
            <Text style={styles.conversionSwapText}>⇅</Text>
          </Pressable>
          <View style={styles.conversionDividerLine} />
        </View>

        {/* To Section */}
        <Pressable
          accessibilityRole="button"
          onPress={() => setPickerTarget("toUnit")}
          style={styles.conversionUnitSelector}
        >
          <Text style={styles.conversionUnitLabel}>{toUnit.label}</Text>
          <Text style={styles.conversionUnitSymbol}>{toUnit.symbol} ▾</Text>
        </Pressable>

        <Text
          accessibilityLabel="Conversion output value"
          style={[
            styles.conversionOutput,
            convertedValue === "Error" && styles.conversionErrorText,
          ]}
        >
          {convertedValue || "0"}
        </Text>
      </View>

      {/* Picker Modal */}
      <Modal
        animationType="slide"
        onRequestClose={() => setPickerTarget(null)}
        presentationStyle="pageSheet"
        transparent={false}
        visible={pickerTarget !== null}
      >
        <View style={styles.conversionPickerContainer}>
          <View style={styles.conversionPickerHeader}>
            <Text style={styles.conversionPickerTitle}>
              {pickerTarget === "category"
                ? "Select Category"
                : pickerTarget === "fromUnit"
                  ? "Convert From"
                  : "Convert To"}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => setPickerTarget(null)}
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
                  const active = item.id === category.id;
                  return (
                    <Pressable
                      key={item.id}
                      accessibilityRole="button"
                      accessibilityState={{ selected: active }}
                      onPress={() => selectCategory(item)}
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
              : category.units.map((unit) => {
                  const activeId = pickerTarget === "fromUnit" ? fromUnitId : toUnitId;
                  const active = unit.id === activeId;
                  return (
                    <Pressable
                      key={unit.id}
                      accessibilityRole="button"
                      accessibilityState={{ selected: active }}
                      onPress={() => handlePickerSelect(unit.id)}
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
    </View>
  );
}
