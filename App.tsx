import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Mode = 'basic' | 'scientific';
type Operator = '+' | '-' | 'x' | '/' | 'xy';
type Variant = 'utility' | 'operator' | 'number' | 'scientific';

type ButtonConfig = {
  label: string;
  action?: string;
  variant?: Variant;
  wide?: boolean;
};

const basicButtons: ButtonConfig[][] = [
  [
    { label: 'AC', action: 'clear', variant: 'utility' },
    { label: '+/-', action: 'sign', variant: 'utility' },
    { label: '%', action: 'percent', variant: 'utility' },
    { label: '/', action: '/', variant: 'operator' },
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
    { label: '=', action: 'equals', variant: 'operator' },
  ],
];

const scientificButtons: ButtonConfig[][] = [
  [
    { label: '(', variant: 'scientific' },
    { label: ')', variant: 'scientific' },
    { label: 'mc', action: 'noop', variant: 'scientific' },
    { label: 'm+', action: 'noop', variant: 'scientific' },
    { label: 'm-', action: 'noop', variant: 'scientific' },
    { label: 'mr', action: 'noop', variant: 'scientific' },
  ],
  [
    { label: '2nd', action: 'noop', variant: 'scientific' },
    { label: 'x²', action: 'square', variant: 'scientific' },
    { label: 'x³', action: 'cube', variant: 'scientific' },
    { label: 'xʸ', action: 'xy', variant: 'scientific' },
    { label: 'eˣ', action: 'exp', variant: 'scientific' },
    { label: '10ˣ', action: 'pow10', variant: 'scientific' },
  ],
  [
    { label: '1/x', action: 'reciprocal', variant: 'scientific' },
    { label: '√x', action: 'sqrt', variant: 'scientific' },
    { label: '∛x', action: 'cbrt', variant: 'scientific' },
    { label: 'ʸ√x', action: 'root', variant: 'scientific' },
    { label: 'ln', action: 'ln', variant: 'scientific' },
    { label: 'log₁₀', action: 'log10', variant: 'scientific' },
  ],
  [
    { label: 'x!', action: 'factorial', variant: 'scientific' },
    { label: 'sin', action: 'sin', variant: 'scientific' },
    { label: 'cos', action: 'cos', variant: 'scientific' },
    { label: 'tan', action: 'tan', variant: 'scientific' },
    { label: 'e', action: 'e', variant: 'scientific' },
    { label: 'EE', action: 'ee', variant: 'scientific' },
  ],
  [
    { label: 'Rand', action: 'random', variant: 'scientific' },
    { label: 'sinh', action: 'sinh', variant: 'scientific' },
    { label: 'cosh', action: 'cosh', variant: 'scientific' },
    { label: 'tanh', action: 'tanh', variant: 'scientific' },
    { label: 'π', action: 'pi', variant: 'scientific' },
    { label: 'Deg', action: 'noop', variant: 'scientific' },
  ],
  [
    { label: 'AC', action: 'clear', variant: 'utility' },
    { label: '+/-', action: 'sign', variant: 'utility' },
    { label: '%', action: 'percent', variant: 'utility' },
    { label: '/', action: '/', variant: 'operator' },
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
    { label: '0' },
    { label: '.' },
    { label: '⌫', action: 'backspace', variant: 'utility' },
    { label: '=', action: 'equals', variant: 'operator' },
  ],
];

const menuItems: { label: string; icon: string; mode?: Mode }[] = [
  { label: 'Standard', icon: '+/-', mode: 'basic' },
  { label: 'Scientific', icon: '√x', mode: 'scientific' },
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
    case 'xy':
      return first ** second;
  }
}

function factorial(value: number) {
  if (value < 0 || !Number.isInteger(value) || value > 170) {
    return Number.NaN;
  }

  let result = 1;
  for (let index = 2; index <= value; index += 1) {
    result *= index;
  }
  return result;
}

function formatValue(value: number) {
  if (!Number.isFinite(value)) {
    return 'Error';
  }

  if (Math.abs(value) >= 1e10 || (Math.abs(value) > 0 && Math.abs(value) < 1e-8)) {
    return value.toExponential(6);
  }

  return Number.parseFloat(value.toFixed(8)).toString();
}

export default function App() {
  const [mode, setMode] = useState<Mode>('basic');
  const [menuOpen, setMenuOpen] = useState(false);
  const [display, setDisplay] = useState('0');
  const [storedValue, setStoredValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const clearLabel = useMemo(() => (display === '0' ? 'AC' : 'C'), [display]);
  const activeButtons = mode === 'basic' ? basicButtons : scientificButtons;

  function resetAll() {
    setDisplay('0');
    setStoredValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  }

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

  function applyUnary(action: string) {
    const value = Number(display);
    const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;

    const resultByAction: Record<string, number> = {
      square: value ** 2,
      cube: value ** 3,
      reciprocal: 1 / value,
      sqrt: Math.sqrt(value),
      cbrt: Math.cbrt(value),
      exp: Math.exp(value),
      pow10: 10 ** value,
      ln: Math.log(value),
      log10: Math.log10(value),
      factorial: factorial(value),
      sin: Math.sin(degreesToRadians(value)),
      cos: Math.cos(degreesToRadians(value)),
      tan: Math.tan(degreesToRadians(value)),
      sinh: Math.sinh(value),
      cosh: Math.cosh(value),
      tanh: Math.tanh(value),
    };

    setDisplay(formatValue(resultByAction[action]));
    setWaitingForOperand(true);
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

    resetAll();
  }

  function selectMode(nextMode: Mode) {
    setMode(nextMode);
    setMenuOpen(false);
  }

  function handlePress(button: ButtonConfig) {
    const action = button.action ?? button.label;

    if (/^\d$/.test(action)) {
      inputDigit(action);
      return;
    }

    if (action === '.') {
      inputDecimal();
      return;
    }

    if (action === 'clear') {
      handleClear();
      return;
    }

    if (action === 'sign') {
      setDisplay((current) => (current.startsWith('-') ? current.slice(1) : `-${current}`));
      return;
    }

    if (action === 'percent') {
      setDisplay((current) => formatValue(Number(current) / 100));
      return;
    }

    if (action === 'equals') {
      handleEquals();
      return;
    }

    if (action === 'backspace') {
      setDisplay((current) => (current.length > 1 ? current.slice(0, -1) : '0'));
      return;
    }

    if (action === 'pi' || action === 'e' || action === 'random') {
      const constants = { pi: Math.PI, e: Math.E, random: Math.random() };
      setDisplay(formatValue(constants[action]));
      setWaitingForOperand(true);
      return;
    }

    if (action === 'ee') {
      setDisplay((current) => `${current}e`);
      setWaitingForOperand(false);
      return;
    }

    if (action === 'root') {
      performOperation('xy');
      return;
    }

    if (
      [
        'square',
        'cube',
        'reciprocal',
        'sqrt',
        'cbrt',
        'exp',
        'pow10',
        'ln',
        'log10',
        'factorial',
        'sin',
        'cos',
        'tan',
        'sinh',
        'cosh',
        'tanh',
      ].includes(action)
    ) {
      applyUnary(action);
      return;
    }

    if (['+', '-', 'x', '/', 'xy'].includes(action)) {
      performOperation(action as Operator);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.appShell}>
        <View style={styles.topBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open calculator menu"
            onPress={() => setMenuOpen(true)}
            style={styles.iconButton}
          >
            <Text style={styles.iconText}>☰</Text>
          </Pressable>
          <Text style={styles.modeTitle}>Calculator</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Reset calculator"
            onPress={resetAll}
            style={styles.iconButton}
          >
            <Text style={styles.iconText}>↺</Text>
          </Pressable>
        </View>

        <View style={styles.modeSwitch} accessibilityRole="tablist">
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: mode === 'basic' }}
            onPress={() => selectMode('basic')}
            style={[styles.modeTab, mode === 'basic' && styles.modeTabActive]}
          >
            <Text style={[styles.modeTabText, mode === 'basic' && styles.modeTabTextActive]}>
              Standard
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: mode === 'scientific' }}
            onPress={() => selectMode('scientific')}
            style={[styles.modeTab, mode === 'scientific' && styles.modeTabActive]}
          >
            <Text style={[styles.modeTabText, mode === 'scientific' && styles.modeTabTextActive]}>
              Scientific
            </Text>
          </Pressable>
        </View>

        <View style={[styles.displayPanel, mode === 'scientific' && styles.scientificDisplay]}>
          {mode === 'scientific' && <Text style={styles.angleLabel}>deg</Text>}
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.display}>
            {display}
          </Text>
        </View>

        <View style={[styles.keypad, mode === 'scientific' && styles.scientificKeypad]}>
          {activeButtons.map((row) => (
            <View key={row.map((button) => button.label).join('-')} style={styles.row}>
              {row.map((button) => {
                const label = button.action === 'clear' ? clearLabel : button.label;

                return (
                  <Pressable
                    key={button.label}
                    accessibilityRole="button"
                    accessibilityLabel={label}
                    onPress={() => handlePress(button)}
                    style={({ pressed }) => [
                      styles.button,
                      mode === 'scientific' && styles.scientificButton,
                      button.wide && styles.buttonWide,
                      button.variant === 'utility' && styles.buttonUtility,
                      button.variant === 'operator' && styles.buttonOperator,
                      button.variant === 'scientific' && styles.buttonScientific,
                      pressed && styles.buttonPressed,
                    ]}
                  >
                    <Text
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      style={[
                        styles.buttonText,
                        mode === 'scientific' && styles.scientificButtonText,
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

      {menuOpen && (
        <View style={styles.overlay}>
          <Pressable style={styles.scrim} onPress={() => setMenuOpen(false)} />
          <View style={styles.drawer}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Calculators</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close menu"
                onPress={() => setMenuOpen(false)}
              >
                <Text style={styles.drawerClose}>×</Text>
              </Pressable>
            </View>

            {menuItems.map((item) => {
              const active = item.mode === mode;
              return (
                <Pressable
                  key={item.label}
                  accessibilityRole="button"
                  disabled={!item.mode}
                  onPress={() => item.mode && selectMode(item.mode)}
                  style={[styles.menuItem, active && styles.menuItemActive]}
                >
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                  <Text style={styles.menuText}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#006b4d',
  },
  appShell: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 64,
    paddingHorizontal: 18,
    paddingTop: 32,
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  iconText: {
    color: '#f6fff9',
    fontSize: 32,
    fontWeight: '300',
  },
  modeTitle: {
    color: '#eafff6',
    fontSize: 22,
    fontWeight: '600',
  },
  modeSwitch: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 84, 61, 0.78)',
    borderRadius: 14,
    flexDirection: 'row',
    gap: 4,
    marginTop: 14,
    padding: 4,
    width: '86%',
  },
  modeTab: {
    alignItems: 'center',
    borderRadius: 10,
    flex: 1,
    minHeight: 44,
    justifyContent: 'center',
  },
  modeTabActive: {
    backgroundColor: '#22c997',
  },
  modeTabText: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontSize: 17,
    fontWeight: '600',
  },
  modeTabTextActive: {
    color: '#fff',
  },
  displayPanel: {
    alignItems: 'flex-end',
    borderBottomColor: '#026048',
    borderBottomWidth: 2,
    justifyContent: 'flex-end',
    marginHorizontal: 18,
    minHeight: 150,
    paddingBottom: 24,
  },
  scientificDisplay: {
    minHeight: 118,
  },
  angleLabel: {
    alignSelf: 'flex-start',
    backgroundColor: '#08b987',
    borderRadius: 8,
    color: '#fff',
    fontSize: 18,
    marginBottom: 14,
    overflow: 'hidden',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  display: {
    color: '#f7f7f3',
    fontSize: 78,
    fontWeight: '300',
  },
  keypad: {
    gap: 12,
    paddingBottom: 22,
    paddingHorizontal: 18,
    paddingTop: 22,
  },
  scientificKeypad: {
    gap: 4,
    paddingBottom: 8,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 4,
  },
  button: {
    alignItems: 'center',
    aspectRatio: 1,
    backgroundColor: '#028c69',
    borderRadius: 999,
    flex: 1,
    justifyContent: 'center',
  },
  scientificButton: {
    aspectRatio: 1.23,
    borderRadius: 0,
  },
  buttonWide: {
    aspectRatio: undefined,
    flex: 2.18,
  },
  buttonUtility: {
    backgroundColor: '#19c893',
  },
  buttonOperator: {
    backgroundColor: '#20c792',
  },
  buttonScientific: {
    backgroundColor: '#078765',
  },
  buttonPressed: {
    opacity: 0.65,
  },
  buttonText: {
    color: '#fffaf2',
    fontSize: 34,
    fontWeight: '400',
  },
  scientificButtonText: {
    fontSize: 22,
  },
  utilityText: {
    color: '#f6fff9',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 31, 23, 0.58)',
  },
  drawer: {
    backgroundColor: '#05a979',
    borderBottomRightRadius: 28,
    borderTopRightRadius: 28,
    height: '100%',
    paddingHorizontal: 28,
    paddingTop: 72,
    width: '72%',
  },
  drawerHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  drawerTitle: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '700',
  },
  drawerClose: {
    color: '#fff',
    fontSize: 42,
    fontWeight: '300',
  },
  menuItem: {
    alignItems: 'center',
    borderRadius: 16,
    flexDirection: 'row',
    minHeight: 58,
    paddingHorizontal: 18,
  },
  menuItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  menuIcon: {
    color: '#fff',
    fontSize: 30,
    marginRight: 22,
    textAlign: 'center',
    width: 38,
  },
  menuText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '400',
  },
});
