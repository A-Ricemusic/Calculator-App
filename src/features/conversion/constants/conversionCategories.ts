import type { ConversionCategory } from "../types";

const fahrenheitOffset = 459.67;
const milesPerGallonUsToLitersPer100Km = 235.214583;
const milesPerGallonUkToLitersPer100Km = 282.480936;

function reciprocalToBase(factor: number) {
  return (value: number) => (value > 0 ? factor / value : Number.NaN);
}

function reciprocalFromBase(factor: number) {
  return (value: number) => (value > 0 ? factor / value : Number.NaN);
}

export const conversionCategories: readonly ConversionCategory[] = [
  {
    id: "length",
    label: "Length",
    baseUnitId: "meter",
    units: [
      { id: "millimeter", label: "Millimeter", symbol: "mm", toBaseFactor: 0.001 },
      { id: "centimeter", label: "Centimeter", symbol: "cm", toBaseFactor: 0.01 },
      { id: "meter", label: "Meter", symbol: "m", toBaseFactor: 1 },
      { id: "kilometer", label: "Kilometer", symbol: "km", toBaseFactor: 1000 },
      { id: "inch", label: "Inch", symbol: "in", toBaseFactor: 0.0254 },
      { id: "foot", label: "Foot", symbol: "ft", toBaseFactor: 0.3048 },
      { id: "yard", label: "Yard", symbol: "yd", toBaseFactor: 0.9144 },
      { id: "mile", label: "Mile", symbol: "mi", toBaseFactor: 1609.344 },
      { id: "nauticalMile", label: "Nautical Mile", symbol: "nmi", toBaseFactor: 1852 },
    ],
  },
  {
    id: "area",
    label: "Area",
    baseUnitId: "squareMeter",
    units: [
      { id: "squareMillimeter", label: "Square Millimeter", symbol: "mm2", toBaseFactor: 0.000001 },
      { id: "squareCentimeter", label: "Square Centimeter", symbol: "cm2", toBaseFactor: 0.0001 },
      { id: "squareMeter", label: "Square Meter", symbol: "m2", toBaseFactor: 1 },
      { id: "squareKilometer", label: "Square Kilometer", symbol: "km2", toBaseFactor: 1000000 },
      { id: "squareInch", label: "Square Inch", symbol: "in2", toBaseFactor: 0.00064516 },
      { id: "squareFoot", label: "Square Foot", symbol: "ft2", toBaseFactor: 0.09290304 },
      { id: "squareYard", label: "Square Yard", symbol: "yd2", toBaseFactor: 0.83612736 },
      { id: "acre", label: "Acre", symbol: "ac", toBaseFactor: 4046.8564224 },
      { id: "hectare", label: "Hectare", symbol: "ha", toBaseFactor: 10000 },
      { id: "squareMile", label: "Square Mile", symbol: "mi2", toBaseFactor: 2589988.110336 },
    ],
  },
  {
    id: "volume",
    label: "Volume",
    baseUnitId: "liter",
    units: [
      { id: "milliliter", label: "Milliliter", symbol: "mL", toBaseFactor: 0.001 },
      { id: "liter", label: "Liter", symbol: "L", toBaseFactor: 1 },
      { id: "cubicMeter", label: "Cubic Meter", symbol: "m3", toBaseFactor: 1000 },
      { id: "teaspoon", label: "Teaspoon", symbol: "tsp", toBaseFactor: 0.00492892159375 },
      { id: "tablespoon", label: "Tablespoon", symbol: "tbsp", toBaseFactor: 0.01478676478125 },
      { id: "fluidOunce", label: "Fluid Ounce", symbol: "fl oz", toBaseFactor: 0.0295735295625 },
      { id: "cup", label: "Cup", symbol: "cup", toBaseFactor: 0.2365882365 },
      { id: "pint", label: "Pint", symbol: "pt", toBaseFactor: 0.473176473 },
      { id: "quart", label: "Quart", symbol: "qt", toBaseFactor: 0.946352946 },
      { id: "gallon", label: "Gallon", symbol: "gal", toBaseFactor: 3.785411784 },
    ],
  },
  {
    id: "mass",
    label: "Mass",
    baseUnitId: "kilogram",
    units: [
      { id: "milligram", label: "Milligram", symbol: "mg", toBaseFactor: 0.000001 },
      { id: "gram", label: "Gram", symbol: "g", toBaseFactor: 0.001 },
      { id: "kilogram", label: "Kilogram", symbol: "kg", toBaseFactor: 1 },
      { id: "metricTon", label: "Metric Ton", symbol: "t", toBaseFactor: 1000 },
      { id: "ounce", label: "Ounce", symbol: "oz", toBaseFactor: 0.028349523125 },
      { id: "pound", label: "Pound", symbol: "lb", toBaseFactor: 0.45359237 },
      { id: "stone", label: "Stone", symbol: "st", toBaseFactor: 6.35029318 },
      { id: "usTon", label: "US Ton", symbol: "ton", toBaseFactor: 907.18474 },
    ],
  },
  {
    id: "temperature",
    label: "Temperature",
    baseUnitId: "kelvin",
    units: [
      {
        id: "celsius",
        label: "Celsius",
        symbol: "C",
        toBase: (value) => value + 273.15,
        fromBase: (value) => value - 273.15,
      },
      {
        id: "fahrenheit",
        label: "Fahrenheit",
        symbol: "F",
        toBase: (value) => (value + fahrenheitOffset) * (5 / 9),
        fromBase: (value) => value * (9 / 5) - fahrenheitOffset,
      },
      {
        id: "kelvin",
        label: "Kelvin",
        symbol: "K",
        toBase: (value) => value,
        fromBase: (value) => value,
      },
    ],
  },
  {
    id: "time",
    label: "Time",
    baseUnitId: "second",
    units: [
      { id: "millisecond", label: "Millisecond", symbol: "ms", toBaseFactor: 0.001 },
      { id: "second", label: "Second", symbol: "s", toBaseFactor: 1 },
      { id: "minute", label: "Minute", symbol: "min", toBaseFactor: 60 },
      { id: "hour", label: "Hour", symbol: "hr", toBaseFactor: 3600 },
      { id: "day", label: "Day", symbol: "day", toBaseFactor: 86400 },
      { id: "week", label: "Week", symbol: "wk", toBaseFactor: 604800 },
      { id: "month", label: "Month", symbol: "mo", toBaseFactor: 2629800 },
      { id: "year", label: "Year", symbol: "yr", toBaseFactor: 31557600 },
    ],
  },
  {
    id: "speed",
    label: "Speed",
    baseUnitId: "meterPerSecond",
    units: [
      { id: "meterPerSecond", label: "Meter per Second", symbol: "m/s", toBaseFactor: 1 },
      {
        id: "kilometerPerHour",
        label: "Kilometer per Hour",
        symbol: "km/h",
        toBaseFactor: 1 / 3.6,
      },
      { id: "milePerHour", label: "Mile per Hour", symbol: "mph", toBaseFactor: 0.44704 },
      { id: "knot", label: "Knot", symbol: "kn", toBaseFactor: 0.5144444444444445 },
      { id: "footPerSecond", label: "Foot per Second", symbol: "ft/s", toBaseFactor: 0.3048 },
    ],
  },
  {
    id: "pressure",
    label: "Pressure",
    baseUnitId: "pascal",
    units: [
      { id: "pascal", label: "Pascal", symbol: "Pa", toBaseFactor: 1 },
      { id: "kilopascal", label: "Kilopascal", symbol: "kPa", toBaseFactor: 1000 },
      { id: "bar", label: "Bar", symbol: "bar", toBaseFactor: 100000 },
      { id: "psi", label: "PSI", symbol: "psi", toBaseFactor: 6894.757293168 },
      { id: "atmosphere", label: "Atmosphere", symbol: "atm", toBaseFactor: 101325 },
      { id: "torr", label: "Torr", symbol: "Torr", toBaseFactor: 133.3223684211 },
    ],
  },
  {
    id: "energy",
    label: "Energy",
    baseUnitId: "joule",
    units: [
      { id: "joule", label: "Joule", symbol: "J", toBaseFactor: 1 },
      { id: "kilojoule", label: "Kilojoule", symbol: "kJ", toBaseFactor: 1000 },
      { id: "calorie", label: "Calorie", symbol: "cal", toBaseFactor: 4.184 },
      { id: "kilocalorie", label: "Kilocalorie", symbol: "kcal", toBaseFactor: 4184 },
      { id: "wattHour", label: "Watt-hour", symbol: "Wh", toBaseFactor: 3600 },
      { id: "kilowattHour", label: "Kilowatt-hour", symbol: "kWh", toBaseFactor: 3600000 },
      { id: "btu", label: "BTU", symbol: "BTU", toBaseFactor: 1055.05585262 },
    ],
  },
  {
    id: "power",
    label: "Power",
    baseUnitId: "watt",
    units: [
      { id: "watt", label: "Watt", symbol: "W", toBaseFactor: 1 },
      { id: "kilowatt", label: "Kilowatt", symbol: "kW", toBaseFactor: 1000 },
      { id: "horsepower", label: "Horsepower", symbol: "hp", toBaseFactor: 745.6998715822701 },
    ],
  },
  {
    id: "data",
    label: "Data",
    baseUnitId: "byte",
    units: [
      { id: "bit", label: "Bit", symbol: "bit", toBaseFactor: 0.125 },
      { id: "byte", label: "Byte", symbol: "B", toBaseFactor: 1 },
      { id: "kilobyte", label: "Kilobyte", symbol: "KB", toBaseFactor: 1000 },
      { id: "megabyte", label: "Megabyte", symbol: "MB", toBaseFactor: 1000000 },
      { id: "gigabyte", label: "Gigabyte", symbol: "GB", toBaseFactor: 1000000000 },
      { id: "terabyte", label: "Terabyte", symbol: "TB", toBaseFactor: 1000000000000 },
      { id: "kibibyte", label: "Kibibyte", symbol: "KiB", toBaseFactor: 1024 },
      { id: "mebibyte", label: "Mebibyte", symbol: "MiB", toBaseFactor: 1048576 },
      { id: "gibibyte", label: "Gibibyte", symbol: "GiB", toBaseFactor: 1073741824 },
      { id: "tebibyte", label: "Tebibyte", symbol: "TiB", toBaseFactor: 1099511627776 },
    ],
  },
  {
    id: "angle",
    label: "Angle",
    baseUnitId: "radian",
    units: [
      { id: "degree", label: "Degree", symbol: "deg", toBaseFactor: Math.PI / 180 },
      { id: "radian", label: "Radian", symbol: "rad", toBaseFactor: 1 },
      { id: "gradian", label: "Gradian", symbol: "grad", toBaseFactor: Math.PI / 200 },
      { id: "turn", label: "Turn", symbol: "turn", toBaseFactor: Math.PI * 2 },
    ],
  },
  {
    id: "fuelEconomy",
    label: "Fuel",
    baseUnitId: "litersPer100Kilometers",
    units: [
      {
        id: "litersPer100Kilometers",
        label: "Liters per 100 km",
        symbol: "L/100 km",
        toBase: (value) => (value > 0 ? value : Number.NaN),
        fromBase: (value) => (value > 0 ? value : Number.NaN),
      },
      {
        id: "kilometersPerLiter",
        label: "Kilometers per Liter",
        symbol: "km/L",
        toBase: reciprocalToBase(100),
        fromBase: reciprocalFromBase(100),
      },
      {
        id: "milesPerGallonUs",
        label: "Miles per Gallon US",
        symbol: "mpg US",
        toBase: reciprocalToBase(milesPerGallonUsToLitersPer100Km),
        fromBase: reciprocalFromBase(milesPerGallonUsToLitersPer100Km),
      },
      {
        id: "milesPerGallonUk",
        label: "Miles per Gallon UK",
        symbol: "mpg UK",
        toBase: reciprocalToBase(milesPerGallonUkToLitersPer100Km),
        fromBase: reciprocalFromBase(milesPerGallonUkToLitersPer100Km),
      },
    ],
  },
];
