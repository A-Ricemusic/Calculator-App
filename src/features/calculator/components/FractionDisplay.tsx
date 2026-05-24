import { Text, View } from "react-native";

import type { CalculatorStyles } from "../styles/calculatorStyleTypes";
import type { FractionParts, Rational } from "../utils/fractionMath";
import { formatFractionParts, rationalToParts } from "../utils/fractionMath";

type FractionDisplayProps = {
  currentValue: Rational | null;
  operator: string | null;
  parts: FractionParts;
  storedValue: Rational | null;
  styles: CalculatorStyles;
};

function FractionValue({ parts, styles }: { parts: FractionParts; styles: CalculatorStyles }) {
  const isFraction = Boolean(parts.numerator);

  return (
    <View style={styles.fractionValue}>
      {parts.sign < 0 && <Text style={styles.fractionWhole}>-</Text>}
      {parts.whole !== "0" && <Text style={styles.fractionWhole}>{parts.whole}</Text>}
      {isFraction ? (
        <View style={styles.fractionStack}>
          <Text style={styles.fractionPart}>{parts.numerator}</Text>
          <View style={styles.fractionBar} />
          <Text style={styles.fractionPart}>{parts.denominator || "?"}</Text>
        </View>
      ) : (
        parts.whole === "0" && <Text style={styles.fractionWhole}>0</Text>
      )}
    </View>
  );
}

export function FractionDisplay({
  currentValue,
  operator,
  parts,
  storedValue,
  styles,
}: FractionDisplayProps) {
  return (
    <View style={[styles.displayPanel, styles.fractionDisplayPanel]}>
      <View style={styles.fractionExpression}>
        {storedValue && <FractionValue parts={rationalToParts(storedValue)} styles={styles} />}
        {operator && (
          <Text style={styles.fractionOperator}>{operator === "x" ? "×" : operator}</Text>
        )}
        <FractionValue parts={parts} styles={styles} />
      </View>
      {!currentValue && (
        <Text accessibilityRole="alert" style={styles.fractionWarning}>
          Denominator cannot be 0
        </Text>
      )}
      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.fractionPlainText}>
        {formatFractionParts(parts)}
      </Text>
    </View>
  );
}
