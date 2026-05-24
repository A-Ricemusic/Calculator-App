import { Text, View } from "react-native";

import type { CalculatorStyles } from "../styles/calculatorStyleTypes";
import type { FractionDisplayMode } from "../hooks/useFractionCalculator";
import type { FractionParts, Rational } from "../utils/fractionMath";
import {
  formatFractionParts,
  partsToRational,
  rationalToImproperParts,
  rationalToParts,
} from "../utils/fractionMath";

type FractionDisplayProps = {
  currentValue: Rational | null;
  operator: string | null;
  parts: FractionParts;
  storedValue: Rational | null;
  waitingForOperand: boolean;
  displayMode: FractionDisplayMode;
  styles: CalculatorStyles;
};

function FractionValue({ parts, styles }: { parts: FractionParts; styles: CalculatorStyles }) {
  const isFraction = Boolean(parts.numerator || parts.denominator);

  return (
    <View style={styles.fractionValue}>
      {parts.sign < 0 && <Text style={styles.fractionWhole}>-</Text>}
      {parts.whole !== "0" && <Text style={styles.fractionWhole}>{parts.whole}</Text>}
      {isFraction ? (
        <View style={styles.fractionStack}>
          <Text style={styles.fractionPart}>{parts.numerator || " "}</Text>
          <View style={styles.fractionBar} />
          <Text style={styles.fractionPart}>{parts.denominator || "?"}</Text>
        </View>
      ) : (
        parts.whole === "0" && <Text style={styles.fractionWhole}>0</Text>
      )}
    </View>
  );
}

function formatPartsForDisplay(parts: FractionParts, displayMode: FractionDisplayMode) {
  const value = partsToRational(parts);

  if (!value || displayMode === "mixed") {
    return parts;
  }

  return rationalToImproperParts(value);
}

function formatRationalForDisplay(value: Rational, displayMode: FractionDisplayMode) {
  return displayMode === "mixed" ? rationalToParts(value) : rationalToImproperParts(value);
}

export function FractionDisplay({
  currentValue,
  displayMode,
  operator,
  parts,
  storedValue,
  waitingForOperand,
  styles,
}: FractionDisplayProps) {
  const shouldShowCurrentValue = !operator || !waitingForOperand;
  const displayParts = formatPartsForDisplay(parts, displayMode);

  return (
    <View style={[styles.displayPanel, styles.fractionDisplayPanel]}>
      <View style={styles.fractionExpression}>
        {storedValue && (
          <FractionValue
            parts={formatRationalForDisplay(storedValue, displayMode)}
            styles={styles}
          />
        )}
        {operator && (
          <Text style={styles.fractionOperator}>{operator === "x" ? "×" : operator}</Text>
        )}
        {shouldShowCurrentValue && <FractionValue parts={displayParts} styles={styles} />}
      </View>
      {!waitingForOperand && !currentValue && (
        <Text accessibilityRole="alert" style={styles.fractionWarning}>
          Denominator cannot be 0
        </Text>
      )}
      {shouldShowCurrentValue && (
        <Text numberOfLines={1} adjustsFontSizeToFit style={styles.fractionPlainText}>
          {formatFractionParts(displayParts)}
        </Text>
      )}
    </View>
  );
}
