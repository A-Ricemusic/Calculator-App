import type { ButtonConfig } from "../types";

export const basicButtons: ButtonConfig[][] = [
  [
    { label: "⌫", action: "backspace", accessibilityLabel: "Backspace", variant: "utility" },
    { label: "AC", action: "clear", variant: "utility" },
    { label: "%", action: "percent", variant: "utility" },
    { label: "÷", action: "/", variant: "operator" },
  ],
  [
    { label: "7" },
    { label: "8" },
    { label: "9" },
    { label: "×", action: "x", variant: "operator" },
  ],
  [{ label: "6" }, { label: "5" }, { label: "4" }, { label: "-", variant: "operator" }],
  [{ label: "3" }, { label: "2" }, { label: "1" }, { label: "+", variant: "operator" }],
  [
    { label: "±", action: "sign", variant: "utility" },
    { label: "0" },
    { label: "." },
    { label: "=", action: "equals", variant: "operator" },
  ],
];

export const scientificFnButtons: ButtonConfig[][] = [
  [
    { label: "(", variant: "scientific" },
    { label: ")", variant: "scientific" },
    { label: "mc", action: "noop", variant: "scientific" },
    { label: "m+", action: "noop", variant: "scientific" },
    { label: "m−", action: "noop", variant: "scientific" },
    { label: "mr", action: "noop", variant: "scientific" },
  ],
  [
    { label: "↑", action: "noop", variant: "scientific" },
    { label: "x²", action: "square", variant: "scientific" },
    { label: "x³", action: "cube", variant: "scientific" },
    { label: "xʸ", action: "xy", variant: "scientific" },
    { label: "eˣ", action: "exp", variant: "scientific" },
    { label: "10ˣ", action: "pow10", variant: "scientific" },
  ],
  [
    { label: "¹⁄ₓ", action: "reciprocal", variant: "scientific" },
    { label: "√x", action: "sqrt", variant: "scientific" },
    { label: "³√x", action: "cbrt", variant: "scientific" },
    { label: "ʸ√x", action: "root", variant: "scientific" },
    { label: "ln", action: "ln", variant: "scientific" },
    { label: "log₁₀", action: "log10", variant: "scientific" },
  ],
  [
    { label: "x!", action: "factorial", variant: "scientific" },
    { label: "sin", action: "sin", variant: "scientific" },
    { label: "cos", action: "cos", variant: "scientific" },
    { label: "tan", action: "tan", variant: "scientific" },
    { label: "e", action: "e", variant: "scientific" },
    { label: "EE", action: "ee", variant: "scientific" },
  ],
  [
    { label: "Rand", action: "random", variant: "scientific" },
    { label: "sinh", action: "sinh", variant: "scientific" },
    { label: "cosh", action: "cosh", variant: "scientific" },
    { label: "tanh", action: "tanh", variant: "scientific" },
    { label: "π", action: "pi", variant: "scientific" },
    { label: "deg/rad", action: "deg", variant: "scientific" },
  ],
];

export const scientificNumButtons: ButtonConfig[][] = [
  [
    { label: "ac", action: "clear", variant: "utility" },
    { label: "+/−", action: "sign", variant: "utility" },
    { label: "%", action: "percent", variant: "utility" },
    { label: "÷", action: "/", variant: "operator" },
  ],
  [
    { label: "7" },
    { label: "8" },
    { label: "9" },
    { label: "×", action: "x", variant: "operator" },
  ],
  [
    { label: "4" },
    { label: "5" },
    { label: "6" },
    { label: "−", action: "-", variant: "operator" },
  ],
  [{ label: "1" }, { label: "2" }, { label: "3" }, { label: "+", variant: "operator" }],
  [
    { label: "0" },
    { label: "." },
    { label: "⌫", action: "backspace", accessibilityLabel: "Backspace", variant: "utility" },
    { label: "=", action: "equals", variant: "operator" },
  ],
];
