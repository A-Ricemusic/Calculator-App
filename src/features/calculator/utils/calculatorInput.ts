function getLastExpressionTokenStart(value: string) {
  for (let index = value.length - 1; index >= 0; index -= 1) {
    const character = value[index];

    if (
      character === "(" ||
      character === ")" ||
      character === "+" ||
      character === "x" ||
      character === "/"
    ) {
      return index + 1;
    }

    if (character === "-") {
      const previous = value[index - 1];

      if (
        index === 0 ||
        previous === "(" ||
        previous === "+" ||
        previous === "x" ||
        previous === "/"
      ) {
        continue;
      }

      return index + 1;
    }
  }

  return 0;
}

export function isExpressionDisplay(value: string) {
  return /[()+x/]/.test(value) || value.slice(1).includes("-");
}

export function hasTrailingBinaryOperator(value: string) {
  return /[+x/-]$/.test(value);
}

export function appendExpressionValue(current: string, value: string) {
  return current === "0" || current === "Error" ? value : `${current}${value}`;
}

export function toggleCalculatorSign(value: string) {
  if (value === "Error") {
    return value;
  }

  if (!isExpressionDisplay(value)) {
    return value.startsWith("-") ? value.slice(1) : `-${value}`;
  }

  const tokenStart = getLastExpressionTokenStart(value);
  const beforeToken = value.slice(0, tokenStart);
  const token = value.slice(tokenStart);

  if (!token) {
    return `${value}-`;
  }

  return token.startsWith("-") ? `${beforeToken}${token.slice(1)}` : `${beforeToken}-${token}`;
}
