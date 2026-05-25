import { useMemo, useState } from "react";

import type { ButtonConfig } from "@features/calculator/types";
import {
  calculateDerivative,
  calculateIntegral,
  getSymbolicDerivative,
  getSymbolicIntegral,
} from "../utils/calculusMath";

export type CalculusMode = "derivative" | "integral";
export type CalculusFieldId = "expression" | "x" | "lower" | "upper";

type CalculusField = {
  id: CalculusFieldId;
  label: string;
};

const derivativeFields: CalculusField[] = [
  { id: "expression", label: "f(x)" },
  { id: "x", label: "at x" },
];

const integralFields: CalculusField[] = [
  { id: "expression", label: "f(x)" },
  { id: "lower", label: "from" },
  { id: "upper", label: "to" },
];

const initialValues: Record<CalculusFieldId, string> = {
  expression: "",
  x: "0",
  lower: "0",
  upper: "0",
};

export function useCalculusCalculator() {
  const [mode, setMode] = useState<CalculusMode>("derivative");
  const [activeField, setActiveField] = useState<CalculusFieldId>("expression");
  const [values, setValues] = useState(initialValues);
  const fields = mode === "derivative" ? derivativeFields : integralFields;

  const result = useMemo(() => {
    if (!values.expression.trim()) {
      return "";
    }

    try {
      if (mode === "derivative") {
        return calculateDerivative(values.expression, values.x);
      }

      return calculateIntegral(values.expression, values.lower, values.upper);
    } catch (error) {
      return error instanceof Error ? error.message : "Error";
    }
  }, [mode, values]);

  const symbolicResult = useMemo(() => {
    if (!values.expression.trim()) {
      return "";
    }

    if (mode === "derivative") {
      return getSymbolicDerivative(values.expression);
    }

    return getSymbolicIntegral(values.expression);
  }, [mode, values.expression]);

  function selectMode(nextMode: CalculusMode) {
    setMode(nextMode);
    setActiveField("expression");
  }

  function updateActiveField(update: (current: string) => string) {
    setValues((current) => ({
      ...current,
      [activeField]: update(current[activeField]),
    }));
  }

  function appendToken(token: string) {
    updateActiveField((current) => {
      if (activeField !== "expression" && !/^([0-9.-]|PI|E)$/.test(token)) {
        return current;
      }

      if (current === "0" && /^([0-9x]|PI|E)$/.test(token)) {
        return token;
      }

      return `${current}${token}`;
    });
  }

  function handlePress(button: ButtonConfig) {
    const action = button.action ?? button.label;

    if (action === "clear") {
      setValues(initialValues);
      setActiveField("expression");
      return;
    }

    if (action === "backspace") {
      updateActiveField((current) => (current.length <= 1 ? "" : current.slice(0, -1)));
      return;
    }

    if (action === "next") {
      const activeIndex = fields.findIndex((field) => field.id === activeField);
      const nextField = fields[(activeIndex + 1) % fields.length];
      setActiveField(nextField.id);
      return;
    }

    appendToken(action);
  }

  return {
    activeField,
    fields,
    handlePress,
    mode,
    result,
    selectMode,
    setActiveField,
    symbolicResult,
    values,
  };
}
