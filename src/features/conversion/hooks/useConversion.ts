import { useMemo, useState } from "react";

import { conversionCategories } from "../constants/conversionCategories";
import type { ConversionCategory } from "../types";
import {
  convertValue,
  findUnit,
  formatConversionValue,
  parseConversionInput,
} from "../utils/conversionMath";

const initialCategory = conversionCategories[0];

export type ConversionPickerTarget = "category" | "fromUnit" | "toUnit";

function getDefaultFromUnitId(category: ConversionCategory) {
  return category.units.find((unit) => unit.id === category.baseUnitId)?.id ?? category.units[0].id;
}

function getDefaultToUnitId(category: ConversionCategory) {
  return (
    category.units.find((unit) => unit.id !== getDefaultFromUnitId(category))?.id ??
    category.units[0].id
  );
}

export function useConversion() {
  const [categoryId, setCategoryId] = useState(initialCategory.id);
  const [fromUnitId, setFromUnitId] = useState(getDefaultFromUnitId(initialCategory));
  const [toUnitId, setToUnitId] = useState("foot");
  const [inputValue, setInputValue] = useState("1");
  const [pickerTarget, setPickerTarget] = useState<ConversionPickerTarget | null>(null);

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

  function selectPickerItem(id: string) {
    if (pickerTarget === "fromUnit") {
      setFromUnitId(id);
    } else if (pickerTarget === "toUnit") {
      setToUnitId(id);
    }
    setPickerTarget(null);
  }

  return {
    category,
    convertedValue,
    fromUnit,
    fromUnitId,
    inputValue,
    pickerTarget,
    selectCategory,
    selectPickerItem,
    setInputValue,
    setPickerTarget,
    swapUnits,
    toUnit,
    toUnitId,
  };
}
