export type FractionParts = {
  denominator: string;
  numerator: string;
  sign: 1 | -1;
  whole: string;
};

export type Rational = {
  denominator: number;
  numerator: number;
};

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);

  while (y !== 0) {
    const next = x % y;
    x = y;
    y = next;
  }

  return x || 1;
}

export function reduceFraction(value: Rational): Rational {
  if (value.denominator === 0) {
    return value;
  }

  const sign = value.denominator < 0 ? -1 : 1;
  const numerator = value.numerator * sign;
  const denominator = Math.abs(value.denominator);
  const divisor = gcd(numerator, denominator);

  return {
    denominator: denominator / divisor,
    numerator: numerator / divisor,
  };
}

export function partsToRational(parts: FractionParts): Rational | null {
  const whole = Number(parts.whole || "0");
  const numerator = Number(parts.numerator || "0");
  const denominator = Number(parts.denominator || "0");

  if (denominator === 0 && numerator !== 0) {
    return null;
  }

  const unsignedNumerator = denominator === 0 ? whole : whole * denominator + numerator;

  return reduceFraction({
    denominator: denominator === 0 ? 1 : denominator,
    numerator: parts.sign * unsignedNumerator,
  });
}

export function rationalToParts(value: Rational): FractionParts {
  const reduced = reduceFraction(value);
  const sign = reduced.numerator < 0 ? -1 : 1;
  const absoluteNumerator = Math.abs(reduced.numerator);
  const whole = Math.trunc(absoluteNumerator / reduced.denominator);
  const numerator = absoluteNumerator % reduced.denominator;

  return {
    denominator: numerator === 0 ? "" : String(reduced.denominator),
    numerator: numerator === 0 ? "" : String(numerator),
    sign,
    whole: String(whole),
  };
}

export function rationalToImproperParts(value: Rational): FractionParts {
  const reduced = reduceFraction(value);
  const sign = reduced.numerator < 0 ? -1 : 1;
  const numerator = Math.abs(reduced.numerator);

  return {
    denominator: numerator === 0 ? "" : String(reduced.denominator),
    numerator: numerator === 0 ? "" : String(numerator),
    sign,
    whole: "0",
  };
}

export function calculateFractions(left: Rational, right: Rational, operator: string): Rational {
  if (operator === "+") {
    return reduceFraction({
      denominator: left.denominator * right.denominator,
      numerator: left.numerator * right.denominator + right.numerator * left.denominator,
    });
  }

  if (operator === "-") {
    return reduceFraction({
      denominator: left.denominator * right.denominator,
      numerator: left.numerator * right.denominator - right.numerator * left.denominator,
    });
  }

  if (operator === "x") {
    return reduceFraction({
      denominator: left.denominator * right.denominator,
      numerator: left.numerator * right.numerator,
    });
  }

  return reduceFraction({
    denominator: left.denominator * right.numerator,
    numerator: left.numerator * right.denominator,
  });
}

export function formatFractionParts(parts: FractionParts) {
  const sign = parts.sign < 0 ? "-" : "";
  const whole = parts.whole || "0";

  if (!parts.numerator) {
    return `${sign}${whole}`;
  }

  if (!parts.whole || parts.whole === "0") {
    return `${sign}${parts.numerator}/${parts.denominator || "?"}`;
  }

  return `${sign}${whole} ${parts.numerator}/${parts.denominator || "?"}`;
}
