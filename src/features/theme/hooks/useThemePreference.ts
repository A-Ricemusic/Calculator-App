import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

import { themeStorageKey } from "../../../shared/constants/storageKeys";
import { themes } from "../constants/themes";
import type { ThemeId } from "../types";

function isThemeId(value: string | null): value is ThemeId {
  return value !== null && value in themes;
}

export function useThemePreference() {
  const [themeId, setThemeId] = useState<ThemeId>("green");
  const [themeLoaded, setThemeLoaded] = useState(false);

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

  return {
    setThemeId,
    theme: themes[themeId],
    themeId,
  };
}
