import { useWindowDimensions, View } from "react-native";

import type { CalculatorStyles } from "../styles/calculatorStyleTypes";
import type { ButtonConfig, CalculatorMode } from "../types";
import {
  basicButtons,
  scientificFnButtons,
  scientificNumButtons,
} from "../constants/calculatorButtons";
import { CalculatorButton } from "./CalculatorButton";

const COLUMNS = 4;
const KEYPAD_PADDING_H = 16;
const BUTTON_GAP = 12;

type CalculatorKeypadProps = {
  clearLabel: string;
  isSecondFunction: boolean;
  mode: CalculatorMode;
  onPress: (button: ButtonConfig) => void;
  styles: CalculatorStyles;
};

export function CalculatorKeypad({
  clearLabel,
  isSecondFunction,
  mode,
  onPress,
  styles,
}: CalculatorKeypadProps) {
  const { width } = useWindowDimensions();
  const buttonSize =
    mode === "basic"
      ? Math.floor((width - KEYPAD_PADDING_H * 2 - BUTTON_GAP * (COLUMNS - 1)) / COLUMNS)
      : undefined;

  return (
    <>
      {mode === "scientific" && (
        <View style={styles.sciFnSection}>
          {scientificFnButtons.map((row) => (
            <View key={row.map((button) => button.label).join("-")} style={styles.sciFnRow}>
              {row.map((button) => {
                const renderedButton =
                  button.action === "secondFunction"
                    ? {
                        ...button,
                        active: isSecondFunction,
                        label: isSecondFunction ? "↓" : button.label,
                      }
                    : button;

                return (
                  <CalculatorButton
                    key={button.label}
                    button={renderedButton}
                    clearLabel={clearLabel}
                    mode={mode}
                    onPress={onPress}
                    styles={styles}
                    variant="function"
                  />
                );
              })}
            </View>
          ))}
        </View>
      )}

      <View style={[styles.keypad, mode === "scientific" && styles.scientificKeypad]}>
        {(mode === "basic" ? basicButtons : scientificNumButtons).map((row) => (
          <View
            key={row.map((button) => button.label).join("-")}
            style={[styles.row, mode === "scientific" && styles.sciRow]}
          >
            {row.map((button) => (
              <CalculatorButton
                key={button.label}
                button={button}
                buttonSize={buttonSize}
                clearLabel={clearLabel}
                mode={mode}
                onPress={onPress}
                styles={styles}
                variant="number"
              />
            ))}
          </View>
        ))}
      </View>
    </>
  );
}
