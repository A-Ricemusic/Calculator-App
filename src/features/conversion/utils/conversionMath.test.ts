import { describe, expect, it } from "vitest";

import { conversionCategories } from "../constants/conversionCategories";
import {
  convertValue,
  findUnit,
  formatConversionValue,
  parseConversionInput,
} from "./conversionMath";

function category(id: string) {
  const found = conversionCategories.find((item) => item.id === id);

  if (!found) {
    throw new Error(`Missing test category: ${id}`);
  }

  return found;
}

function convert(categoryId: string, value: number, fromUnitId: string, toUnitId: string) {
  const selectedCategory = category(categoryId);

  return convertValue(
    value,
    findUnit(selectedCategory, fromUnitId),
    findUnit(selectedCategory, toUnitId),
  );
}

describe("conversionMath", () => {
  it("converts meters to feet", () => {
    expect(convert("length", 1, "meter", "foot")).toBeCloseTo(3.280839895, 8);
  });

  it("converts miles to kilometers", () => {
    expect(convert("length", 1, "mile", "kilometer")).toBeCloseTo(1.609344, 8);
  });

  it("converts kilograms to pounds", () => {
    expect(convert("mass", 1, "kilogram", "pound")).toBeCloseTo(2.2046226218, 8);
  });

  it("converts Celsius to Fahrenheit", () => {
    expect(convert("temperature", 100, "celsius", "fahrenheit")).toBeCloseTo(212, 8);
  });

  it("converts Fahrenheit to Kelvin", () => {
    expect(convert("temperature", 32, "fahrenheit", "kelvin")).toBeCloseTo(273.15, 8);
  });

  it("converts liters to US gallons", () => {
    expect(convert("volume", 1, "liter", "gallon")).toBeCloseTo(0.2641720524, 8);
  });

  it("converts bytes to bits and GiB to bytes", () => {
    expect(convert("data", 1, "byte", "bit")).toBe(8);
    expect(convert("data", 1, "gibibyte", "byte")).toBe(1073741824);
  });

  it("converts degrees to radians", () => {
    expect(convert("angle", 180, "degree", "radian")).toBeCloseTo(Math.PI, 8);
  });

  it("converts mpg US to L/100 km", () => {
    expect(convert("fuelEconomy", 25, "milesPerGallonUs", "litersPer100Kilometers")).toBeCloseTo(
      9.40858332,
      8,
    );
  });

  it("rejects impossible reciprocal fuel economy values", () => {
    expect(convert("fuelEconomy", 0, "milesPerGallonUs", "litersPer100Kilometers")).toBeNaN();
    expect(convert("fuelEconomy", -1, "kilometersPerLiter", "litersPer100Kilometers")).toBeNaN();
  });

  it("parses empty and invalid input as null", () => {
    expect(parseConversionInput("")).toBeNull();
    expect(parseConversionInput("   ")).toBeNull();
    expect(parseConversionInput("abc")).toBeNull();
    expect(parseConversionInput("1.5")).toBe(1.5);
  });

  it("formats conversion values", () => {
    expect(formatConversionValue(1.234567891)).toBe("1.23456789");
    expect(formatConversionValue(10000000000)).toBe("1.000000e+10");
    expect(formatConversionValue(0.000000001)).toBe("1.000000e-9");
    expect(formatConversionValue(Number.NaN)).toBe("Error");
    expect(formatConversionValue(Number.POSITIVE_INFINITY)).toBe("Error");
  });
});
