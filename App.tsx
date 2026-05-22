import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Operator = '+' | '-' | 'x' | '/';

type ButtonConfig = {
  label: string;
  variant?: 'utility' | 'operator' | 'number';
  wide?: boolean;
};

const buttons: ButtonConfig[][] = [
  [
    { label: 'AC', variant: 'utility' },
    { label: '+/-', variant: 'utility' },
    { label: '%', variant: 'utility' },
    { label: '/', variant: 'operator' },
  ],
  [
    { label: '7' },
    { label: '8' },
    { label: '9' },
    { label: 'x', variant: 'operator' },
  ],
  [
    { label: '4' },
    { label: '5' },
    { label: '6' },
    { label: '-', variant: 'operator' },
  ],
  [
    { label: '1' },
    { label: '2' },
    { label: '3' },
    { label: '+', variant: 'operator' },
  ],
  [
    { label: '0', wide: true },
    { label: '.' },
    { label: '=', variant: 'operator' },
  ],
];

function calculate(first: number, second: number, operator: Operator) {
  switch (operator) {
    case '+':
      return first + second;
    case '-':
      return first - second;
    case 'x':
      return first * second;
    case '/':
      return second === 0 ? Number.NaN : first / second;
  }
}

function formatValue(value: number) {
  if (!Number.isFinite(value)) {
    return 'Error';
  }

  return Number.parseFloat(value.toFixed(8)).toString();
}

export default function App() {
  const [display, setDisplay] = useState('0');
  const [storedValue, setStoredValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const clearLabel = useMemo(() => (display === '0' ? 'AC' : 'C'), [display]);

  function inputDigit(digit: string) {
    if (display === 'Error') {
      setDisplay(digit);
      return;
    }

    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
      return;
    }

    setDisplay((current) => (current === '0' ? digit : `${current}${digit}`));
  }

  function inputDecimal() {
    if (waitingForOperand || display === 'Error') {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }

    if (!display.includes('.')) {
      setDisplay((current) => `${current}.`);
    }
  }

  function performOperation(nextOperator: Operator) {
    const inputValue = Number(display);

    if (storedValue === null) {
      setStoredValue(inputValue);
    } else if (operator) {
      const result = calculate(storedValue, inputValue, operator);
      setDisplay(formatValue(result));
      setStoredValue(result);
    }

    setOperator(nextOperator);
    setWaitingForOperand(true);
  }

  function handleEquals() {
    if (storedValue === null || operator === null) {
      return;
    }

    const result = calculate(storedValue, Number(display), operator);
    setDisplay(formatValue(result));
    setStoredValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  }

  function handleClear() {
    if (display !== '0') {
      setDisplay('0');
      return;
    }

    setStoredValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  }

  function handlePress(label: string) {
    if (/^\d$/.test(label)) {
      inputDigit(label);
      return;
    }

    if (label === '.') {
      inputDecimal();
      return;
    }

    if (label === 'AC') {
      handleClear();
      return;
    }

    if (label === '+/-') {
      setDisplay((current) => (current.startsWith('-') ? current.slice(1) : `-${current}`));
      return;
    }

    if (label === '%') {
      setDisplay((current) => formatValue(Number(current) / 100));
      return;
    }

    if (label === '=') {
      handleEquals();
      return;
    }

    performOperation(label as Operator);
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.displayPanel}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.display}>
            {display}
          </Text>
        </View>

        <View style={styles.keypad}>
          {buttons.map((row) => (
            <View key={row.map((button) => button.label).join('-')} style={styles.row}>
              {row.map((button) => {
                const label = button.label === 'AC' ? clearLabel : button.label;

                return (
                  <Pressable
                    key={button.label}
                    accessibilityRole="button"
                    accessibilityLabel={label}
                    onPress={() => handlePress(button.label)}
                    style={({ pressed }) => [
                      styles.button,
                      button.wide && styles.buttonWide,
                      button.variant === 'utility' && styles.buttonUtility,
                      button.variant === 'operator' && styles.buttonOperator,
                      pressed && styles.buttonPressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        button.variant === 'utility' && styles.utilityText,
                      ]}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#111315',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 18,
    paddingBottom: 22,
  },
  displayPanel: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    minHeight: 180,
    paddingBottom: 24,
  },
  display: {
    color: '#f7f7f3',
    fontSize: 72,
    fontWeight: '300',
  },
  keypad: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    alignItems: 'center',
    aspectRatio: 1,
    backgroundColor: '#303438',
    borderRadius: 999,
    flex: 1,
    justifyContent: 'center',
  },
  buttonWide: {
    aspectRatio: undefined,
    flex: 2.18,
  },
  buttonUtility: {
    backgroundColor: '#a9adb0',
  },
  buttonOperator: {
    backgroundColor: '#f09a36',
  },
  buttonPressed: {
    opacity: 0.65,
  },
  buttonText: {
    color: '#fffaf2',
    fontSize: 32,
    fontWeight: '500',
  },
  utilityText: {
    color: '#141619',
  },
});
