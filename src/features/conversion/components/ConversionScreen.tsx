import { Pressable, Text, TextInput, View } from "react-native";

import type { ConversionStyles } from "../styles/conversionStyleTypes";
import { ConversionPickerModal } from "./ConversionPickerModal";
import { useConversion } from "../hooks/useConversion";

type ConversionScreenProps = {
  styles: ConversionStyles;
};

export function ConversionScreen({ styles }: ConversionScreenProps) {
  const conversion = useConversion();

  return (
    <View style={styles.conversionScreen}>
      <Pressable
        accessibilityRole="button"
        onPress={() => conversion.setPickerTarget("category")}
        style={styles.conversionCategorySelector}
      >
        <Text style={styles.conversionCategorySelectorText}>{conversion.category.label}</Text>
        <Text style={styles.conversionChevron}>▾</Text>
      </Pressable>

      <View style={styles.conversionCard}>
        <Pressable
          accessibilityRole="button"
          onPress={() => conversion.setPickerTarget("fromUnit")}
          style={styles.conversionUnitSelector}
        >
          <Text style={styles.conversionUnitLabel}>{conversion.fromUnit.label}</Text>
          <Text style={styles.conversionUnitSymbol}>{conversion.fromUnit.symbol} ▾</Text>
        </Pressable>

        <TextInput
          accessibilityLabel="Conversion input value"
          inputMode="decimal"
          keyboardType="numbers-and-punctuation"
          onChangeText={conversion.setInputValue}
          placeholder="0"
          placeholderTextColor={styles.conversionPlaceholder?.color as string}
          selectTextOnFocus
          style={styles.conversionInput}
          value={conversion.inputValue}
        />

        <View style={styles.conversionDividerRow}>
          <View style={styles.conversionDividerLine} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Swap conversion units"
            onPress={conversion.swapUnits}
            style={styles.conversionSwapButton}
          >
            <Text style={styles.conversionSwapText}>⇅</Text>
          </Pressable>
          <View style={styles.conversionDividerLine} />
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => conversion.setPickerTarget("toUnit")}
          style={styles.conversionUnitSelector}
        >
          <Text style={styles.conversionUnitLabel}>{conversion.toUnit.label}</Text>
          <Text style={styles.conversionUnitSymbol}>{conversion.toUnit.symbol} ▾</Text>
        </Pressable>

        <Text
          accessibilityLabel="Conversion output value"
          style={[
            styles.conversionOutput,
            conversion.convertedValue === "Error" && styles.conversionErrorText,
          ]}
        >
          {conversion.convertedValue || "0"}
        </Text>
      </View>

      <ConversionPickerModal
        activeCategory={conversion.category}
        activeFromUnitId={conversion.fromUnitId}
        activeToUnitId={conversion.toUnitId}
        onClose={() => conversion.setPickerTarget(null)}
        onSelectCategory={conversion.selectCategory}
        onSelectUnit={conversion.selectPickerItem}
        pickerTarget={conversion.pickerTarget}
        styles={styles}
      />
    </View>
  );
}
