import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";

import { calculatorHistoryStorageKey } from "../../../shared/constants/storageKeys";
import type { CalculatorHistoryEntry } from "../types";
import {
  createHistoryEntry,
  isCalculatorHistoryEntry,
  maxHistoryEntries,
  shouldStoreHistoryResult,
} from "./calculatorHistory";

export function useCalculatorHistory() {
  const [history, setHistory] = useState<CalculatorHistoryEntry[]>([]);
  const historyLoadedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      try {
        const storedHistory = await AsyncStorage.getItem(calculatorHistoryStorageKey);
        const parsedHistory = storedHistory ? JSON.parse(storedHistory) : [];

        if (!cancelled && Array.isArray(parsedHistory)) {
          setHistory(parsedHistory.filter(isCalculatorHistoryEntry).slice(0, maxHistoryEntries));
        }
      } catch {
        if (!cancelled) {
          setHistory([]);
        }
      } finally {
        historyLoadedRef.current = true;
      }
    }

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!historyLoadedRef.current) {
      return;
    }

    AsyncStorage.setItem(calculatorHistoryStorageKey, JSON.stringify(history)).catch(() => {});
  }, [history]);

  function addHistoryEntry(expression: string, result: string) {
    if (!shouldStoreHistoryResult(result)) {
      return;
    }

    setHistory((current) =>
      [createHistoryEntry(expression, result), ...current].slice(0, maxHistoryEntries),
    );
  }

  function clearHistory() {
    setHistory([]);
  }

  return {
    addHistoryEntry,
    clearHistory,
    history,
  };
}
