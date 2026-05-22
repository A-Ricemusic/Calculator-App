import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  GestureResponderEvent,
  PanResponder,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Mode = 'basic' | 'scientific' | 'notes';
type Operator = '+' | '-' | 'x' | '/' | 'xy';
type Variant = 'utility' | 'operator' | 'number' | 'scientific';
type ThemeId = 'green' | 'red' | 'pink' | 'classic';
type NoteTool = 'pen' | 'marker' | 'highlighter' | 'eraser' | 'text';
type MathNote = {
  id: string;
  body: string;
  savedAt: string;
};
type Point = {
  x: number;
  y: number;
};
type Stroke = {
  id: string;
  color: string;
  tool: Exclude<NoteTool, 'text'>;
  width: number;
  points: Point[];
};
type TextBlock = {
  id: string;
  body: string;
  x: number;
  y: number;
};
type NotePage = {
  id: string;
  title: string;
  strokes: Stroke[];
  textBlocks: TextBlock[];
};
type NoteCollection = {
  id: string;
  title: string;
  pageCount: number;
  pages: NotePage[];
  updatedAt: string;
};

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
  { label: 'Math Notes', icon: '≡', mode: 'notes' },
];

const themeStorageKey = 'calculator-theme-id';
const notesStorageKey = 'calculator-math-notes';
const notePagesStorageKey = 'calculator-math-note-pages';
const noteCollectionsStorageKey = 'calculator-math-note-collections';
const utensilColors = ['#ffffff', '#1495ff', '#facc15', '#fb7185', '#34d399', '#a78bfa'];
const collectionPageSizes = [5, 10, 20];
const noteDots = Array.from({ length: 360 }, (_, index) => ({
  id: index,
  left: (index % 24) * 18 + 12,
  top: Math.floor(index / 24) * 24 + 12,
}));
const toolSettings: Record<Exclude<NoteTool, 'text'>, { label: string; icon: string; width: number }> = {
  pen: { label: 'Pen', icon: '✎', width: 5 },
  marker: { label: 'Marker', icon: '▮', width: 9 },
  highlighter: { label: 'Highlighter', icon: '▰', width: 16 },
  eraser: { label: 'Eraser', icon: '⌫', width: 24 },
};

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

function isMathNote(value: unknown): value is MathNote {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const note = value as Partial<MathNote>;
  return typeof note.id === 'string'
    && typeof note.body === 'string'
    && typeof note.savedAt === 'string';
}

function isPoint(value: unknown): value is Point {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const point = value as Partial<Point>;
  return typeof point.x === 'number' && typeof point.y === 'number';
}

function isStroke(value: unknown): value is Stroke {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const stroke = value as Partial<Stroke>;
  return typeof stroke.id === 'string'
    && typeof stroke.color === 'string'
    && typeof stroke.width === 'number'
    && Array.isArray(stroke.points)
    && stroke.points.every(isPoint)
    && (
      stroke.tool === 'pen'
      || stroke.tool === 'marker'
      || stroke.tool === 'highlighter'
      || stroke.tool === 'eraser'
    );
}

function isTextBlock(value: unknown): value is TextBlock {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const textBlock = value as Partial<TextBlock>;
  return typeof textBlock.id === 'string'
    && typeof textBlock.body === 'string'
    && typeof textBlock.x === 'number'
    && typeof textBlock.y === 'number';
}

function isNotePage(value: unknown): value is NotePage {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const page = value as Partial<NotePage>;
  return typeof page.id === 'string'
    && typeof page.title === 'string'
    && Array.isArray(page.strokes)
    && page.strokes.every(isStroke)
    && Array.isArray(page.textBlocks)
    && page.textBlocks.every(isTextBlock);
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function createBlankPage(index: number): NotePage {
  return {
    id: createId(`page-${index + 1}`),
    title: `Page ${index + 1}`,
    strokes: [],
    textBlocks: [],
  };
}

function createPages(count: number) {
  return Array.from({ length: count }, (_, index) => createBlankPage(index));
}

function createCollection(pageCount: number, index = 0): NoteCollection {
  return {
    id: createId('collection'),
    title: `Math Notes ${index + 1}`,
    pageCount,
    pages: createPages(pageCount),
    updatedAt: new Date().toISOString(),
  };
}

function isNoteCollection(value: unknown): value is NoteCollection {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const collection = value as Partial<NoteCollection>;
  return typeof collection.id === 'string'
    && typeof collection.title === 'string'
    && typeof collection.pageCount === 'number'
    && typeof collection.updatedAt === 'string'
    && Array.isArray(collection.pages)
    && collection.pages.length > 0
    && collection.pages.every(isNotePage);
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
  const [notes, setNotes] = useState<MathNote[]>([]);
  const [notesLoaded, setNotesLoaded] = useState(false);
  const [noteCollections, setNoteCollections] = useState<NoteCollection[]>(() => [createCollection(10)]);
  const [noteCollectionsLoaded, setNoteCollectionsLoaded] = useState(false);
  const [activeCollectionIndex, setActiveCollectionIndex] = useState(0);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [activeTool, setActiveTool] = useState<NoteTool>('pen');
  const [activeColor, setActiveColor] = useState('#ffffff');
  const [textDraft, setTextDraft] = useState('');
  const [drawingStroke, setDrawingStroke] = useState<Stroke | null>(null);
  const drawingStrokeRef = useRef<Stroke | null>(null);

  const theme = themes[themeId];
  const styles = useMemo(() => createStyles(theme), [theme]);
  const activeCollection = noteCollections[activeCollectionIndex] ?? noteCollections[0];
  const activePages = activeCollection?.pages ?? [];
  const activePage = activePages[activePageIndex] ?? activePages[0];
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

  useEffect(() => {
    AsyncStorage.getItem(notesStorageKey)
      .then((storedNotes) => {
        if (!storedNotes) {
          return;
        }

        const parsedNotes = JSON.parse(storedNotes);
        if (Array.isArray(parsedNotes)) {
          setNotes(parsedNotes.filter(isMathNote));
        }
      })
      .catch(() => undefined)
      .finally(() => setNotesLoaded(true));
  }, []);

  useEffect(() => {
    if (!notesLoaded) {
      return;
    }

    AsyncStorage.setItem(notesStorageKey, JSON.stringify(notes)).catch(() => undefined);
  }, [notes, notesLoaded]);

  useEffect(() => {
    AsyncStorage.getItem(noteCollectionsStorageKey)
      .then((storedCollections) => {
        if (!storedCollections) {
          return AsyncStorage.getItem(notePagesStorageKey);
        }

        const parsedCollections = JSON.parse(storedCollections);
        if (Array.isArray(parsedCollections)) {
          const validCollections = parsedCollections.filter(isNoteCollection);
          if (validCollections.length > 0) {
            setNoteCollections(validCollections);
            setActiveCollectionIndex(0);
            setActivePageIndex(0);
          }
        }

        return null;
      })
      .then((storedPages) => {
        if (!storedPages) {
          return;
        }

        const parsedPages = JSON.parse(storedPages);
        if (Array.isArray(parsedPages)) {
          const validPages = parsedPages.filter(isNotePage);
          if (validPages.length > 0) {
            setNoteCollections([{
              id: createId('collection'),
              title: 'Math Notes 1',
              pageCount: validPages.length,
              pages: validPages,
              updatedAt: new Date().toISOString(),
            }]);
            setActiveCollectionIndex(0);
            setActivePageIndex(0);
          }
        }
      })
      .catch(() => undefined)
      .finally(() => setNoteCollectionsLoaded(true));
  }, []);

  useEffect(() => {
    if (!noteCollectionsLoaded) {
      return;
    }

    AsyncStorage.setItem(noteCollectionsStorageKey, JSON.stringify(noteCollections)).catch(() => undefined);
  }, [noteCollections, noteCollectionsLoaded]);

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

  function updateActivePage(updater: (page: NotePage) => NotePage) {
    setNoteCollections((current) => current.map((collection, collectionIndex) => {
      if (collectionIndex !== activeCollectionIndex) {
        return collection;
      }

      return {
        ...collection,
        pages: collection.pages.map((page, pageIndex) => (
          pageIndex === activePageIndex ? updater(page) : page
        )),
        updatedAt: new Date().toISOString(),
      };
    }));
  }

  function addPage() {
    setNoteCollections((current) => current.map((collection, collectionIndex) => {
      if (collectionIndex !== activeCollectionIndex) {
        return collection;
      }

      setActivePageIndex(collection.pages.length);
      return {
        ...collection,
        pageCount: collection.pages.length + 1,
        pages: [...collection.pages, createBlankPage(collection.pages.length)],
        updatedAt: new Date().toISOString(),
      };
    }));
  }

  function changePage(direction: -1 | 1) {
    setActivePageIndex((current) => {
      const nextIndex = current + direction;
      return Math.min(Math.max(nextIndex, 0), activePages.length - 1);
    });
  }

  function selectCollection(collectionIndex: number) {
    setActiveCollectionIndex(collectionIndex);
    setActivePageIndex(0);
    setDrawingStroke(null);
    drawingStrokeRef.current = null;
  }

  function selectCollectionSize(pageCount: number) {
    const matchingCollectionIndex = noteCollections.findIndex((collection) => collection.pageCount === pageCount);

    if (matchingCollectionIndex >= 0) {
      selectCollection(matchingCollectionIndex);
      return;
    }

    setNoteCollections((current) => {
      const nextCollection = createCollection(pageCount, current.length);
      setActiveCollectionIndex(current.length);
      setActivePageIndex(0);
      return [...current, nextCollection];
    });
  }

  function saveNotebookSnapshot() {
    const pageCount = activePages.length.toString().padStart(2, '0');
    setNotes((current) => [
      {
        id: createId('note'),
        body: `Saved collection mock: ${activeCollection?.title ?? 'Math Notes'} (${pageCount} pages)`,
        savedAt: new Date().toISOString(),
      },
      ...current,
    ]);
  }

  function addTextBlock() {
    const body = textDraft.trim();

    if (!body) {
      return;
    }

    updateActivePage((page) => ({
      ...page,
      textBlocks: [
        ...page.textBlocks,
        {
          id: createId('text'),
          body,
          x: 32,
          y: 160 + page.textBlocks.length * 42,
        },
      ],
    }));
    setTextDraft('');
  }

  function pointFromEvent(event: GestureResponderEvent) {
    const { locationX, locationY } = event.nativeEvent;
    return { x: locationX, y: locationY };
  }

  function eraseAt(point: Point) {
    updateActivePage((page) => ({
      ...page,
      strokes: page.strokes.filter((stroke) => !stroke.points.some((strokePoint) => {
        const distance = Math.hypot(strokePoint.x - point.x, strokePoint.y - point.y);
        return distance <= toolSettings.eraser.width;
      })),
    }));
  }

  function beginStroke(event: GestureResponderEvent) {
    const point = pointFromEvent(event);

    if (activeTool === 'text') {
      return;
    }

    if (activeTool === 'eraser') {
      eraseAt(point);
      return;
    }

    const nextStroke: Stroke = {
      id: createId('stroke'),
      color: activeColor,
      tool: activeTool,
      width: toolSettings[activeTool].width,
      points: [point],
    };

    drawingStrokeRef.current = nextStroke;
    setDrawingStroke(nextStroke);
  }

  function appendStrokePoint(event: GestureResponderEvent) {
    const point = pointFromEvent(event);

    if (activeTool === 'text') {
      return;
    }

    if (activeTool === 'eraser') {
      eraseAt(point);
      return;
    }

    const currentStroke = drawingStrokeRef.current;
    if (!currentStroke) {
      return;
    }

    const nextStroke = {
      ...currentStroke,
      points: [...currentStroke.points, point],
    };
    drawingStrokeRef.current = nextStroke;
    setDrawingStroke(nextStroke);
  }

  function finishStroke() {
    const currentStroke = drawingStrokeRef.current;

    if (!currentStroke) {
      return;
    }

    if (currentStroke.points.length > 1) {
      updateActivePage((page) => ({
        ...page,
        strokes: [...page.strokes, currentStroke],
      }));
    }

    drawingStrokeRef.current = null;
    setDrawingStroke(null);
  }

  const notePanResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => activeTool !== 'text',
    onPanResponderGrant: beginStroke,
    onPanResponderMove: appendStrokePoint,
    onPanResponderRelease: finishStroke,
    onPanResponderTerminate: finishStroke,
  }), [activeTool, activeColor, activeCollectionIndex, activePageIndex, noteCollections]);

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

  function renderStroke(stroke: Stroke) {
    return stroke.points.slice(1).map((point, index) => {
      const previousPoint = stroke.points[index];
      const length = Math.hypot(point.x - previousPoint.x, point.y - previousPoint.y);
      const angle = Math.atan2(point.y - previousPoint.y, point.x - previousPoint.x);

      return (
        <View
          key={`${stroke.id}-${index}`}
          pointerEvents="none"
          style={[
            styles.strokeSegment,
            {
              backgroundColor: stroke.tool === 'eraser' ? theme.colors.screen : stroke.color,
              height: stroke.width,
              left: previousPoint.x,
              opacity: stroke.tool === 'highlighter' ? 0.45 : 1,
              top: previousPoint.y - stroke.width / 2,
              transform: [
                { rotateZ: `${angle}rad` },
                { translateX: length / 2 },
              ],
              width: length,
            },
          ]}
        />
      );
    });
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style={theme.statusBar} />
      <View style={styles.appShell}>
        <View style={styles.topBar}>
          <View style={styles.topBarLeft}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open calculator menu"
              onPress={() => setMenuOpen(true)}
              style={styles.iconButton}
            >
              <Text style={styles.iconText}>☰</Text>
            </Pressable>
            {mode === 'scientific' && <Text style={styles.angleLabel}>rad</Text>}
          </View>
          {mode === 'basic' && <Text style={styles.modeTitle}>Calculator</Text>}
          {mode === 'notes' && <Text style={styles.modeTitle}>Math Notes</Text>}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Reset calculator"
            onPress={resetAll}
            style={styles.iconButton}
          >
            <Text style={styles.iconText}>↺</Text>
          </Pressable>
        </View>

        {mode === 'notes' ? (
          <View style={styles.notesContainer}>
            <View style={styles.notesHeader}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back to calculator"
                onPress={() => setMode('basic')}
                style={styles.notesBackBtn}
              >
                <Text style={styles.notesBackIcon}>‹</Text>
              </Pressable>
              <View style={styles.notesHeaderCenter}>
                <Text numberOfLines={1} style={styles.notesTitle}>
                  {activeCollection?.title ?? 'Math Notes'}
                </Text>
              </View>
              <Text style={styles.notesPageBadge}>
                {(activePageIndex + 1).toString().padStart(2, '0')}/{activePages.length.toString().padStart(2, '0')}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Save notebook"
                onPress={saveNotebookSnapshot}
                style={styles.notesSaveBtn}
              >
                <Text style={styles.notesSaveIcon}>✓</Text>
              </Pressable>
            </View>

            <View style={styles.collectionPanel}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.collectionList}
              >
                {noteCollections.map((collection, index) => (
                  <Pressable
                    key={collection.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected: index === activeCollectionIndex }}
                    accessibilityLabel={`Open ${collection.title}`}
                    onPress={() => selectCollection(index)}
                    style={[
                      styles.collectionChip,
                      index === activeCollectionIndex && styles.collectionChipActive,
                    ]}
                  >
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.collectionChipTitle,
                        index === activeCollectionIndex && styles.collectionChipTitleActive,
                      ]}
                    >
                      {collection.title}
                    </Text>
                    <Text
                      style={[
                        styles.collectionChipMeta,
                        index === activeCollectionIndex && styles.collectionChipMetaActive,
                      ]}
                    >
                      {collection.pages.length} pages
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>

              <View style={styles.collectionSizeRow}>
                {collectionPageSizes.map((pageCount) => (
                  <Pressable
                    key={pageCount}
                    accessibilityRole="button"
                    accessibilityLabel={`Switch to ${pageCount} page collection`}
                    onPress={() => selectCollectionSize(pageCount)}
                    style={[
                      styles.collectionSizeButton,
                      activeCollection?.pageCount === pageCount && styles.collectionSizeButtonActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.collectionSizeText,
                        activeCollection?.pageCount === pageCount && styles.collectionSizeTextActive,
                      ]}
                    >
                      {pageCount}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.notesCanvasWrap}>
              <View style={styles.notesCanvas} {...notePanResponder.panHandlers}>
                {noteDots.map((dot) => (
                  <View
                    key={dot.id}
                    pointerEvents="none"
                    style={[styles.notesDot, { left: dot.left, top: dot.top }]}
                  />
                ))}
                {activePage?.strokes.map((stroke) => renderStroke(stroke))}
                {drawingStroke && renderStroke(drawingStroke)}
                {activePage?.textBlocks.map((textBlock) => (
                  <Text
                    key={textBlock.id}
                    style={[
                      styles.canvasTextBlock,
                      {
                        color: activeColor,
                        left: textBlock.x,
                        top: textBlock.y,
                      },
                    ]}
                  >
                    {textBlock.body}
                  </Text>
                ))}
              </View>
            </View>

            {activeTool === 'text' && (
              <View style={styles.notesTextBar}>
                <TextInput
                  accessibilityLabel="Text to add to page"
                  onChangeText={setTextDraft}
                  placeholder="Type to add text…"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  style={styles.notesTextInput}
                  value={textDraft}
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Add text"
                  onPress={addTextBlock}
                  style={styles.notesTextAddBtn}
                >
                  <Text style={styles.notesTextAddLabel}>Add</Text>
                </Pressable>
              </View>
            )}

            <View style={styles.notesToolbar}>
              <View style={styles.notesToolRow}>
                {(['pen', 'marker', 'highlighter', 'eraser'] as Exclude<NoteTool, 'text'>[]).map((tool) => (
                  <Pressable
                    key={tool}
                    accessibilityRole="button"
                    accessibilityLabel={`Select ${tool}`}
                    onPress={() => setActiveTool(tool)}
                    style={[
                      styles.notesToolBtn,
                      activeTool === tool && styles.notesToolBtnActive,
                    ]}
                  >
                    <Text style={[
                      styles.notesToolIcon,
                      activeTool === tool && styles.notesToolIconActive,
                    ]}>
                      {toolSettings[tool].icon}
                    </Text>
                  </Pressable>
                ))}
                <View style={styles.notesToolDivider} />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Select text tool"
                  onPress={() => setActiveTool('text')}
                  style={[
                    styles.notesToolBtn,
                    activeTool === 'text' && styles.notesToolBtnActive,
                  ]}
                >
                  <Text style={[
                    styles.notesToolIcon,
                    activeTool === 'text' && styles.notesToolIconActive,
                  ]}>
                    Aa
                  </Text>
                </Pressable>
              </View>
              <View style={styles.notesToolDivider} />
              <View style={styles.notesColorRow}>
                {utensilColors.map((color) => (
                  <Pressable
                    key={color}
                    accessibilityRole="button"
                    accessibilityLabel={`Set color ${color}`}
                    onPress={() => setActiveColor(color)}
                    style={[
                      styles.notesColorDot,
                      { backgroundColor: color },
                      activeColor === color && styles.notesColorDotActive,
                    ]}
                  />
                ))}
              </View>
            </View>

            <View style={styles.notesPageNav}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Previous page"
                disabled={activePageIndex === 0}
                onPress={() => changePage(-1)}
                style={[styles.notesPageBtn, activePageIndex === 0 && styles.notesPageBtnDisabled]}
              >
                <Text style={styles.notesPageBtnText}>‹</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Create new page"
                onPress={addPage}
                style={styles.notesNewPageBtn}
              >
                <Text style={styles.notesNewPageText}>+ New Page</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Next page"
                disabled={activePageIndex === activePages.length - 1}
                onPress={() => changePage(1)}
                style={[
                  styles.notesPageBtn,
                  activePageIndex === activePages.length - 1 && styles.notesPageBtnDisabled,
                ]}
              >
                <Text style={styles.notesPageBtnText}>›</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <>
            <View style={[styles.displayPanel, mode === 'scientific' && styles.scientificDisplay]}>
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
          </>
        )}
      </View>

      {menuOpen && (
        <View style={styles.overlay}>
          <Pressable style={styles.scrim} onPress={() => setMenuOpen(false)} />
          <View style={styles.drawer}>
            <SafeAreaView style={styles.drawerInner}>
              <View style={styles.drawerHeader}>
                <Text style={styles.drawerTitle}>Calculator</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Close menu"
                  onPress={() => setMenuOpen(false)}
                  style={styles.drawerCloseButton}
                >
                  <Text style={styles.drawerCloseIcon}>✕</Text>
                </Pressable>
              </View>

              <ScrollView
                contentContainerStyle={styles.drawerContent}
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.drawerSectionLabel}>MODE</Text>
                <View style={styles.drawerSection}>
                  {menuItems.map((item, index) => {
                    const active = item.mode === mode;
                    const isLast = index === menuItems.length - 1;
                    return (
                      <Pressable
                        key={item.label}
                        accessibilityRole="button"
                        accessibilityState={{ selected: active }}
                        disabled={!item.mode}
                        onPress={() => item.mode && selectMode(item.mode)}
                        style={[styles.menuItem, !isLast && styles.menuItemBorder]}
                      >
                        <Text style={styles.menuIcon}>{item.icon}</Text>
                        <Text style={[styles.menuText, active && styles.menuTextActive]}>
                          {item.label}
                        </Text>
                        {active && <Text style={styles.menuCheck}>✓</Text>}
                      </Pressable>
                    );
                  })}
                </View>

                <Text style={styles.drawerSectionLabel}>THEME</Text>
                <View style={styles.drawerSection}>
                  {themeItems.map((item, index) => {
                    const active = item.id === themeId;
                    const isLast = index === themeItems.length - 1;
                    return (
                      <Pressable
                        key={item.id}
                        accessibilityRole="button"
                        accessibilityState={{ selected: active }}
                        onPress={() => selectTheme(item.id)}
                        style={[styles.menuItem, !isLast && styles.menuItemBorder]}
                      >
                        <View style={styles.themeDot}>
                          <View style={[styles.themeDotInner, { backgroundColor: item.colors.buttonOperator }]} />
                        </View>
                        <Text style={[styles.menuText, active && styles.menuTextActive]}>
                          {item.label}
                        </Text>
                        {active && <Text style={styles.menuCheck}>✓</Text>}
                      </Pressable>
                    );
                  })}
                </View>
              </ScrollView>
            </SafeAreaView>
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
    topBarLeft: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 8,
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
    notesContainer: {
      backgroundColor: '#0f1115',
      flex: 1,
    },
    notesHeader: {
      alignItems: 'center',
      borderBottomColor: 'rgba(255, 255, 255, 0.06)',
      borderBottomWidth: 1,
      flexDirection: 'row',
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    notesBackBtn: {
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      borderRadius: 10,
      height: 36,
      justifyContent: 'center',
      width: 36,
    },
    notesBackIcon: {
      color: '#ffffff',
      fontSize: 24,
      fontWeight: '300',
      lineHeight: 28,
    },
    notesHeaderCenter: {
      flex: 1,
    },
    notesTitle: {
      color: '#ffffff',
      fontSize: 17,
      fontWeight: '600',
    },
    notesPageBadge: {
      color: 'rgba(255, 255, 255, 0.4)',
      fontSize: 13,
      fontWeight: '600',
    },
    notesSaveBtn: {
      alignItems: 'center',
      backgroundColor: '#3b82f6',
      borderRadius: 10,
      height: 36,
      justifyContent: 'center',
      width: 36,
    },
    notesSaveIcon: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '700',
    },
    collectionPanel: {
      backgroundColor: '#15181d',
      borderBottomColor: 'rgba(255, 255, 255, 0.06)',
      borderBottomWidth: 1,
      paddingBottom: 8,
      paddingTop: 8,
    },
    collectionList: {
      gap: 8,
      paddingHorizontal: 12,
    },
    collectionChip: {
      backgroundColor: 'rgba(255, 255, 255, 0.06)',
      borderColor: 'rgba(255, 255, 255, 0.08)',
      borderRadius: 10,
      borderWidth: 1,
      minWidth: 112,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    collectionChipActive: {
      backgroundColor: '#22324f',
      borderColor: '#3b82f6',
    },
    collectionChipTitle: {
      color: 'rgba(255, 255, 255, 0.72)',
      fontSize: 13,
      fontWeight: '700',
    },
    collectionChipTitleActive: {
      color: '#ffffff',
    },
    collectionChipMeta: {
      color: 'rgba(255, 255, 255, 0.38)',
      fontSize: 11,
      fontWeight: '600',
      marginTop: 2,
    },
    collectionChipMetaActive: {
      color: 'rgba(255, 255, 255, 0.68)',
    },
    collectionSizeRow: {
      flexDirection: 'row',
      gap: 8,
      paddingHorizontal: 12,
      paddingTop: 8,
    },
    collectionSizeButton: {
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.06)',
      borderColor: 'rgba(255, 255, 255, 0.08)',
      borderRadius: 999,
      borderWidth: 1,
      height: 30,
      justifyContent: 'center',
      minWidth: 58,
      paddingHorizontal: 12,
    },
    collectionSizeButtonActive: {
      backgroundColor: '#3b82f6',
      borderColor: '#3b82f6',
    },
    collectionSizeText: {
      color: 'rgba(255, 255, 255, 0.62)',
      fontSize: 13,
      fontWeight: '800',
    },
    collectionSizeTextActive: {
      color: '#ffffff',
    },
    notesCanvasWrap: {
      borderColor: 'rgba(255, 255, 255, 0.06)',
      borderRadius: 16,
      borderWidth: 1,
      flex: 1,
      marginHorizontal: 12,
      marginTop: 8,
      overflow: 'hidden',
    },
    notesCanvas: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: '#121418',
    },
    notesDot: {
      backgroundColor: 'rgba(255, 255, 255, 0.07)',
      borderRadius: 999,
      height: 1.5,
      position: 'absolute',
      width: 1.5,
    },
    strokeSegment: {
      borderRadius: 999,
      position: 'absolute',
      transformOrigin: 'left center',
    },
    canvasTextBlock: {
      backgroundColor: 'rgba(15, 17, 21, 0.72)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 8,
      borderWidth: StyleSheet.hairlineWidth,
      fontSize: 22,
      fontWeight: '600',
      maxWidth: '80%',
      paddingHorizontal: 12,
      paddingVertical: 8,
      position: 'absolute',
    },
    notesTextBar: {
      alignItems: 'center',
      backgroundColor: '#1a1d22',
      borderColor: 'rgba(255, 255, 255, 0.08)',
      borderRadius: 12,
      borderWidth: 1,
      flexDirection: 'row',
      gap: 8,
      marginHorizontal: 12,
      marginTop: 8,
      padding: 6,
    },
    notesTextInput: {
      color: '#ffffff',
      flex: 1,
      fontSize: 15,
      minHeight: 38,
      paddingHorizontal: 12,
    },
    notesTextAddBtn: {
      alignItems: 'center',
      backgroundColor: '#3b82f6',
      borderRadius: 8,
      justifyContent: 'center',
      minHeight: 38,
      paddingHorizontal: 18,
    },
    notesTextAddLabel: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: '700',
    },
    notesToolbar: {
      alignItems: 'center',
      backgroundColor: '#1a1d22',
      borderColor: 'rgba(255, 255, 255, 0.06)',
      borderRadius: 14,
      borderWidth: 1,
      flexDirection: 'row',
      gap: 6,
      marginHorizontal: 12,
      marginTop: 8,
      paddingHorizontal: 8,
      paddingVertical: 6,
    },
    notesToolRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 2,
    },
    notesToolBtn: {
      alignItems: 'center',
      borderRadius: 8,
      height: 34,
      justifyContent: 'center',
      width: 34,
    },
    notesToolBtnActive: {
      backgroundColor: '#3b82f6',
    },
    notesToolIcon: {
      color: 'rgba(255, 255, 255, 0.5)',
      fontSize: 18,
      fontWeight: '700',
    },
    notesToolIconActive: {
      color: '#ffffff',
    },
    notesToolDivider: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      height: 24,
      marginHorizontal: 4,
      width: 1,
    },
    notesColorRow: {
      alignItems: 'center',
      flex: 1,
      flexDirection: 'row',
      gap: 6,
      justifyContent: 'flex-end',
    },
    notesColorDot: {
      borderColor: 'rgba(255, 255, 255, 0.15)',
      borderRadius: 999,
      borderWidth: 1.5,
      height: 20,
      width: 20,
    },
    notesColorDotActive: {
      borderColor: '#ffffff',
      borderWidth: 2.5,
      transform: [{ scale: 1.15 }],
    },
    notesPageNav: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 10,
      justifyContent: 'center',
      paddingBottom: 16,
      paddingTop: 8,
    },
    notesPageBtn: {
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      borderRadius: 10,
      height: 32,
      justifyContent: 'center',
      width: 32,
    },
    notesPageBtnDisabled: {
      opacity: 0.25,
    },
    notesPageBtnText: {
      color: '#ffffff',
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 22,
    },
    notesNewPageBtn: {
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      borderRadius: 10,
      justifyContent: 'center',
      paddingHorizontal: 14,
      paddingVertical: 7,
    },
    notesNewPageText: {
      color: 'rgba(255, 255, 255, 0.6)',
      fontSize: 13,
      fontWeight: '600',
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
      borderBottomRightRadius: 20,
      borderTopRightRadius: 20,
      height: '100%',
      width: '72%',
    },
    drawerInner: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 12,
    },
    drawerHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    drawerTitle: {
      color: theme.colors.topText,
      fontSize: 22,
      fontWeight: '700',
    },
    drawerCloseButton: {
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
      borderRadius: 999,
      height: 32,
      justifyContent: 'center',
      width: 32,
    },
    drawerCloseIcon: {
      color: theme.colors.mutedText,
      fontSize: 14,
      fontWeight: '600',
    },
    drawerContent: {
      paddingBottom: 36,
    },
    drawerSectionLabel: {
      color: theme.colors.mutedText,
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 1.2,
      marginBottom: 6,
      marginTop: 8,
      paddingHorizontal: 4,
    },
    drawerSection: {
      backgroundColor: 'rgba(255, 255, 255, 0.06)',
      borderRadius: 12,
      marginBottom: 20,
      overflow: 'hidden',
    },
    menuItem: {
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: 14,
      paddingVertical: 14,
    },
    menuItemBorder: {
      borderBottomColor: 'rgba(255, 255, 255, 0.08)',
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    menuIcon: {
      color: theme.colors.mutedText,
      fontSize: 18,
      marginRight: 14,
      textAlign: 'center',
      width: 28,
    },
    menuText: {
      color: theme.colors.topText,
      flex: 1,
      fontSize: 17,
      fontWeight: '400',
    },
    menuTextActive: {
      fontWeight: '600',
    },
    menuCheck: {
      color: theme.colors.segmentedActive,
      fontSize: 18,
      fontWeight: '600',
    },
    themeDot: {
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
      width: 28,
    },
    themeDotInner: {
      borderRadius: 999,
      height: 18,
      width: 18,
    },
  });
}
