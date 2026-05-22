import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Mode = 'basic' | 'scientific';
type Operator = '+' | '-' | 'x' | '/' | 'xy';
type Variant = 'utility' | 'operator' | 'number' | 'scientific';
type ThemeId = 'green' | 'red' | 'pink' | 'classic';

type CalculatorTheme = {
  id: ThemeId;
  label: string;
  statusBar: 'light' | 'dark';
  colors: {
    screen: string;
    topText: string;
    mutedText: string;
    displayText: string;
    divider: string;
    segmentedBackground: string;
    segmentedActive: string;
    buttonNumber: string;
    buttonUtility: string;
    buttonOperator: string;
    buttonScientific: string;
    sciFnText: string;
    buttonText: string;
    utilityText: string;
    angleBadge: string;
    drawerBackground: string;
    drawerScrim: string;
    drawerActive: string;
  };
};

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

const scientificFnButtons: ButtonConfig[][] = [
  [
    { label: '(', variant: 'scientific' },
    { label: ')', variant: 'scientific' },
    { label: 'mc', action: 'noop', variant: 'scientific' },
    { label: 'm+', action: 'noop', variant: 'scientific' },
    { label: 'm−', action: 'noop', variant: 'scientific' },
    { label: 'mr', action: 'noop', variant: 'scientific' },
  ],
  [
    { label: '↑', action: 'noop', variant: 'scientific' },
    { label: 'x²', action: 'square', variant: 'scientific' },
    { label: 'x³', action: 'cube', variant: 'scientific' },
    { label: 'xʸ', action: 'xy', variant: 'scientific' },
    { label: 'eˣ', action: 'exp', variant: 'scientific' },
    { label: '10ˣ', action: 'pow10', variant: 'scientific' },
  ],
  [
    { label: '¹⁄ₓ', action: 'reciprocal', variant: 'scientific' },
    { label: '√x', action: 'sqrt', variant: 'scientific' },
    { label: '³√x', action: 'cbrt', variant: 'scientific' },
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
];

const scientificNumButtons: ButtonConfig[][] = [
  [
    { label: 'ac', action: 'clear', variant: 'utility' },
    { label: '+/−', action: 'sign', variant: 'utility' },
    { label: '%', action: 'percent', variant: 'utility' },
    { label: '÷', action: '/', variant: 'operator' },
  ],
  [
    { label: '7' },
    { label: '8' },
    { label: '9' },
    { label: '×', action: 'x', variant: 'operator' },
  ],
  [
    { label: '4' },
    { label: '5' },
    { label: '6' },
    { label: '−', action: '-', variant: 'operator' },
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

const themeStorageKey = 'calculator-theme-id';

const themes: Record<ThemeId, CalculatorTheme> = {
  green: {
    id: 'green',
    label: 'Green',
    statusBar: 'light',
    colors: {
      screen: '#006b4d',
      topText: '#f6fff9',
      mutedText: 'rgba(255, 255, 255, 0.72)',
      displayText: '#f7f7f3',
      divider: '#026048',
      segmentedBackground: 'rgba(0, 84, 61, 0.78)',
      segmentedActive: '#22c997',
      buttonNumber: '#028c69',
      buttonUtility: '#19c893',
      buttonOperator: '#20c792',
      buttonScientific: 'rgba(255, 255, 255, 0.1)',
      sciFnText: '#c8f5e5',
      buttonText: '#fffaf2',
      utilityText: '#f6fff9',
      angleBadge: 'rgba(8, 185, 135, 0.3)',
      drawerBackground: '#05a979',
      drawerScrim: 'rgba(0, 31, 23, 0.58)',
      drawerActive: 'rgba(255, 255, 255, 0.18)',
    },
  },
  red: {
    id: 'red',
    label: 'Red',
    statusBar: 'light',
    colors: {
      screen: '#7f1d1d',
      topText: '#fff5f5',
      mutedText: 'rgba(255, 245, 245, 0.74)',
      displayText: '#fffafa',
      divider: '#991b1b',
      segmentedBackground: 'rgba(69, 10, 10, 0.48)',
      segmentedActive: '#ef4444',
      buttonNumber: '#b91c1c',
      buttonUtility: '#dc2626',
      buttonOperator: '#f97316',
      buttonScientific: 'rgba(255, 255, 255, 0.1)',
      sciFnText: '#fecaca',
      buttonText: '#fff7ed',
      utilityText: '#fffafa',
      angleBadge: 'rgba(239, 68, 68, 0.3)',
      drawerBackground: '#b91c1c',
      drawerScrim: 'rgba(39, 6, 6, 0.62)',
      drawerActive: 'rgba(255, 255, 255, 0.2)',
    },
  },
  pink: {
    id: 'pink',
    label: 'Pink',
    statusBar: 'light',
    colors: {
      screen: '#831843',
      topText: '#fff1f7',
      mutedText: 'rgba(255, 241, 247, 0.76)',
      displayText: '#fff7fb',
      divider: '#9d174d',
      segmentedBackground: 'rgba(80, 7, 36, 0.54)',
      segmentedActive: '#f472b6',
      buttonNumber: '#be185d',
      buttonUtility: '#ec4899',
      buttonOperator: '#f43f5e',
      buttonScientific: 'rgba(255, 255, 255, 0.1)',
      sciFnText: '#fbcfe8',
      buttonText: '#fff7fb',
      utilityText: '#fff7fb',
      angleBadge: 'rgba(219, 39, 119, 0.3)',
      drawerBackground: '#be185d',
      drawerScrim: 'rgba(48, 5, 24, 0.62)',
      drawerActive: 'rgba(255, 255, 255, 0.2)',
    },
  },
  classic: {
    id: 'classic',
    label: 'Classic',
    statusBar: 'light',
    colors: {
      screen: '#000000',
      topText: '#ffffff',
      mutedText: 'rgba(255, 255, 255, 0.72)',
      displayText: '#ffffff',
      divider: '#1c1c1e',
      segmentedBackground: '#1c1c1e',
      segmentedActive: '#505050',
      buttonNumber: '#333333',
      buttonUtility: '#a5a5a5',
      buttonOperator: '#ff9f0a',
      buttonScientific: 'rgba(255, 255, 255, 0.08)',
      sciFnText: 'rgba(255, 255, 255, 0.85)',
      buttonText: '#ffffff',
      utilityText: '#000000',
      angleBadge: 'rgba(80, 80, 80, 0.4)',
      drawerBackground: '#1c1c1e',
      drawerScrim: 'rgba(0, 0, 0, 0.68)',
      drawerActive: 'rgba(255, 255, 255, 0.16)',
    },
  },
};

const themeItems = Object.values(themes);

function isThemeId(value: string | null): value is ThemeId {
  return value !== null && value in themes;
}

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
  const [themeId, setThemeId] = useState<ThemeId>('green');
  const [themeLoaded, setThemeLoaded] = useState(false);
  const [display, setDisplay] = useState('0');
  const [storedValue, setStoredValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const theme = themes[themeId];
  const styles = useMemo(() => createStyles(theme), [theme]);
  const clearLabel = useMemo(
    () => (mode === 'scientific'
      ? (display === '0' ? 'ac' : 'c')
      : (display === '0' ? 'AC' : 'C')),
    [display, mode],
  );

  useEffect(() => {
    AsyncStorage.getItem(themeStorageKey)
      .then((storedThemeId) => {
        if (isThemeId(storedThemeId)) {
          setThemeId(storedThemeId);
        }
      })
      .finally(() => setThemeLoaded(true))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!themeLoaded) {
      return;
    }

    AsyncStorage.setItem(themeStorageKey, themeId).catch(() => undefined);
  }, [themeId, themeLoaded]);

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

  function selectTheme(nextThemeId: ThemeId) {
    setThemeId(nextThemeId);
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

  function renderSciFnButton(button: ButtonConfig) {
    const label = button.action === 'clear' ? clearLabel : button.label;

    return (
      <Pressable
        key={button.label}
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={() => handlePress(button)}
        style={({ pressed }) => [
          styles.sciFnButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.6}
          style={styles.sciFnButtonText}
        >
          {label}
        </Text>
      </Pressable>
    );
  }

  function renderNumButton(button: ButtonConfig) {
    const label = button.action === 'clear' ? clearLabel : button.label;
    const isScientificMode = mode === 'scientific';

    return (
      <Pressable
        key={button.label}
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={() => handlePress(button)}
        style={({ pressed }) => [
          styles.button,
          isScientificMode && styles.sciNumButton,
          button.wide && styles.buttonWide,
          button.variant === 'utility' && styles.buttonUtility,
          button.variant === 'operator' && styles.buttonOperator,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.6}
          style={[
            styles.buttonText,
            isScientificMode && styles.sciNumButtonText,
            button.variant === 'utility' && styles.utilityText,
          ]}
        >
          {label}
        </Text>
      </Pressable>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style={theme.statusBar} />
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
          {mode === 'basic' && <Text style={styles.modeTitle}>Calculator</Text>}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Reset calculator"
            onPress={resetAll}
            style={styles.iconButton}
          >
            <Text style={styles.iconText}>↺</Text>
          </Pressable>
        </View>

        <View style={[styles.displayPanel, mode === 'scientific' && styles.scientificDisplay]}>
          {mode === 'scientific' && <Text style={styles.angleLabel}>rad</Text>}
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={[styles.display, mode === 'scientific' && styles.scientificDisplayText]}
          >
            {display}
          </Text>
        </View>

        {mode === 'scientific' && (
          <View style={styles.sciFnSection}>
            {scientificFnButtons.map((row) => (
              <View key={row.map((b) => b.label).join('-')} style={styles.sciFnRow}>
                {row.map((button) => renderSciFnButton(button))}
              </View>
            ))}
          </View>
        )}

        <View style={[styles.keypad, mode === 'scientific' && styles.scientificKeypad]}>
          {(mode === 'basic' ? basicButtons : scientificNumButtons).map((row) => (
            <View key={row.map((b) => b.label).join('-')} style={[styles.row, mode === 'scientific' && styles.sciRow]}>
              {row.map((button) => renderNumButton(button))}
            </View>
          ))}
        </View>
      </View>

      {menuOpen && (
        <View style={styles.overlay}>
          <Pressable style={styles.scrim} onPress={() => setMenuOpen(false)} />
          <View style={styles.drawer}>
            <View style={styles.drawerHeader}>
              <View>
                <Text style={styles.drawerEyebrow}>Calculator App</Text>
                <Text style={styles.drawerTitle}>{mode === 'basic' ? 'Standard' : 'Scientific'}</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close menu"
                onPress={() => setMenuOpen(false)}
              >
                <Text style={styles.drawerClose}>×</Text>
              </Pressable>
            </View>

            <ScrollView
              contentContainerStyle={styles.drawerContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.drawerSectionHeader}>
                <Text style={styles.drawerSectionHeading}>Calculators</Text>
                <Text style={styles.drawerChevron}>⌄</Text>
              </View>

              {menuItems.map((item) => {
                const active = item.mode === mode;
                return (
                  <Pressable
                    key={item.label}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    accessibilityLabel={`Switch to ${item.label} calculator`}
                    disabled={!item.mode}
                    onPress={() => item.mode && selectMode(item.mode)}
                    style={[styles.menuItem, active && styles.menuItemActive]}
                  >
                    <Text style={styles.menuIcon}>{item.icon}</Text>
                    <Text style={styles.menuText}>{item.label}</Text>
                  </Pressable>
                );
              })}

              <View style={styles.drawerDivider} />

              <View style={styles.drawerSectionHeader}>
                <Text style={styles.drawerSectionHeading}>Preferences</Text>
                <Text style={styles.drawerChevron}>⌄</Text>
              </View>

              {themeItems.map((item) => {
                const active = item.id === themeId;

                return (
                  <Pressable
                    key={item.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    accessibilityLabel={`Use ${item.label} theme`}
                    onPress={() => selectTheme(item.id)}
                    style={[styles.menuItem, active && styles.menuItemActive]}
                  >
                    <View style={styles.themeSwatches}>
                      <View
                        style={[
                          styles.themeSwatch,
                          { backgroundColor: item.colors.buttonNumber },
                        ]}
                      />
                      <View
                        style={[
                          styles.themeSwatch,
                          { backgroundColor: item.colors.buttonUtility },
                        ]}
                      />
                      <View
                        style={[
                          styles.themeSwatch,
                          { backgroundColor: item.colors.buttonOperator },
                        ]}
                      />
                    </View>
                    <Text style={styles.menuText}>{item.label}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

function createStyles(theme: CalculatorTheme) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.screen,
    },
    appShell: {
      flex: 1,
    },
    topBar: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 12,
      paddingTop: 4,
      paddingBottom: 2,
    },
    iconButton: {
      alignItems: 'center',
      borderRadius: 24,
      height: 44,
      justifyContent: 'center',
      width: 44,
    },
    iconText: {
      color: theme.colors.topText,
      fontSize: 28,
      fontWeight: '300',
    },
    modeTitle: {
      color: theme.colors.topText,
      fontSize: 20,
      fontWeight: '600',
    },
    displayPanel: {
      alignItems: 'flex-end',
      borderBottomColor: theme.colors.divider,
      borderBottomWidth: 1,
      flex: 1,
      justifyContent: 'flex-end',
      marginHorizontal: 16,
      paddingBottom: 16,
    },
    scientificDisplay: {
      paddingBottom: 8,
    },
    angleLabel: {
      alignSelf: 'flex-start',
      backgroundColor: theme.colors.angleBadge,
      borderRadius: 4,
      color: theme.colors.sciFnText,
      fontSize: 14,
      fontWeight: '600',
      overflow: 'hidden',
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    display: {
      color: theme.colors.displayText,
      fontSize: 80,
      fontWeight: '200',
    },
    scientificDisplayText: {
      fontSize: 60,
    },

    sciFnSection: {
      gap: 0,
      marginHorizontal: 0,
    },
    sciFnRow: {
      flexDirection: 'row',
      gap: 0,
    },
    sciFnButton: {
      alignItems: 'center',
      backgroundColor: 'transparent',
      borderBottomColor: theme.colors.divider,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderRightColor: theme.colors.divider,
      borderRightWidth: StyleSheet.hairlineWidth,
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 2,
      paddingVertical: 9,
    },
    sciFnButtonText: {
      color: theme.colors.sciFnText,
      fontSize: 15,
      fontWeight: '400',
    },

    keypad: {
      gap: 12,
      paddingBottom: 22,
      paddingHorizontal: 16,
      paddingTop: 18,
    },
    scientificKeypad: {
      gap: 7,
      paddingBottom: 12,
      paddingHorizontal: 10,
      paddingTop: 6,
    },
    row: {
      flexDirection: 'row',
      gap: 10,
    },
    sciRow: {
      gap: 8,
    },
    button: {
      alignItems: 'center',
      aspectRatio: 1,
      backgroundColor: theme.colors.buttonNumber,
      borderRadius: 999,
      flex: 1,
      justifyContent: 'center',
    },
    sciNumButton: {
      aspectRatio: undefined,
      borderRadius: 10,
      paddingVertical: 12,
    },
    buttonWide: {
      aspectRatio: undefined,
      flex: 2.18,
    },
    buttonUtility: {
      backgroundColor: theme.colors.buttonUtility,
    },
    buttonOperator: {
      backgroundColor: theme.colors.buttonOperator,
    },
    buttonPressed: {
      opacity: 0.65,
    },
    buttonText: {
      color: theme.colors.buttonText,
      fontSize: 34,
      fontWeight: '400',
    },
    sciNumButtonText: {
      fontSize: 26,
    },
    utilityText: {
      color: theme.colors.utilityText,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      flexDirection: 'row',
    },
    scrim: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.colors.drawerScrim,
    },
    drawer: {
      backgroundColor: theme.colors.drawerBackground,
      borderBottomRightRadius: 28,
      borderTopRightRadius: 28,
      height: '100%',
      paddingHorizontal: 24,
      paddingTop: 58,
      width: '76%',
    },
    drawerHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 18,
      paddingHorizontal: 4,
    },
    drawerEyebrow: {
      color: theme.colors.mutedText,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 6,
    },
    drawerTitle: {
      color: theme.colors.topText,
      fontSize: 32,
      fontWeight: '700',
    },
    drawerClose: {
      color: theme.colors.topText,
      fontSize: 42,
      fontWeight: '300',
    },
    drawerContent: {
      paddingBottom: 36,
    },
    drawerSectionHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      minHeight: 58,
      paddingHorizontal: 4,
    },
    drawerSectionHeading: {
      color: theme.colors.topText,
      fontSize: 30,
      fontWeight: '700',
    },
    drawerChevron: {
      color: theme.colors.topText,
      fontSize: 42,
      fontWeight: '500',
      lineHeight: 44,
    },
    drawerDivider: {
      backgroundColor: theme.colors.segmentedActive,
      height: 2,
      marginHorizontal: 4,
      marginBottom: 22,
      marginTop: 24,
      opacity: 0.8,
    },
    menuItem: {
      alignItems: 'center',
      borderRadius: 16,
      flexDirection: 'row',
      minHeight: 64,
      paddingHorizontal: 16,
    },
    menuItemActive: {
      backgroundColor: theme.colors.drawerActive,
    },
    menuIcon: {
      color: theme.colors.topText,
      fontSize: 32,
      marginRight: 24,
      textAlign: 'center',
      width: 38,
    },
    menuText: {
      color: theme.colors.topText,
      fontSize: 26,
      fontWeight: '400',
    },
    themeSwatches: {
      flexDirection: 'row',
      marginRight: 24,
      width: 38,
    },
    themeSwatch: {
      borderColor: 'rgba(255, 255, 255, 0.54)',
      borderRadius: 999,
      borderWidth: 1,
      height: 18,
      marginLeft: -4,
      width: 18,
    },
  });
}
