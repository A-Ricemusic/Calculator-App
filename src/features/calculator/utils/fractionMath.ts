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

const invalidRational: Rational = {
  denominator: 0,
  numerator: 0,
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
    return invalidRational;
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

  if (!Number.isFinite(whole) || !Number.isFinite(numerator) || !Number.isFinite(denominator)) {
    return null;
  }

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

  if (reduced.denominator === 0) {
    return {
      denominator: "",
      numerator: "",
      sign: 1,
      whole: "Error",
    };
  }

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

  if (reduced.denominator === 0) {
    return {
      denominator: "",
      numerator: "",
      sign: 1,
      whole: "Error",
    };
  }

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

  if (right.numerator === 0) {
    return invalidRational;
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

export function parseFormattedFractionParts(value: string): FractionParts | null {
  const trimmed = value.trim();

  if (!trimmed || trimmed === "Error") {
    return null;
  }

  const sign = trimmed.startsWith("-") ? -1 : 1;
  const unsigned = trimmed.replace(/^[+-]/, "").trim();
  const [wholeOrFraction, fractionText, extra] = unsigned.split(/\s+/);

  if (!wholeOrFraction || extra !== undefined) {
    return null;
  }

  const fraction = fractionText ?? (wholeOrFraction.includes("/") ? wholeOrFraction : undefined);
  const whole = fractionText
    ? wholeOrFraction
    : wholeOrFraction.includes("/")
      ? "0"
      : wholeOrFraction;
  const [numerator = "", denominator = ""] = fraction?.split("/") ?? [];

  const parts: FractionParts = {
    denominator,
    numerator,
    sign,
    whole,
  };

  return partsToRational(parts) ? parts : null;
}
