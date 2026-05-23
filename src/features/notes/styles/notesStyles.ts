import { StyleSheet } from "react-native";

import type { CalculatorTheme } from "@features/theme";
import { createNotesCanvasStyles } from "./notesCanvasStyles";
import { createNotesManagerStyles } from "./notesManagerStyles";
import { createNotesNavigationStyles } from "./notesNavigationStyles";
import { createNotesToolbarStyles } from "./notesToolbarStyles";

export function createNotesStyles(_theme: CalculatorTheme) {
  return StyleSheet.create({
    notesContainer: {
      backgroundColor: "#0f1115",
      flex: 1,
      overflow: "hidden",
    },
    ...createNotesNavigationStyles(),
    ...createNotesCanvasStyles(),
    ...createNotesToolbarStyles(),
    ...createNotesManagerStyles(),
  });
}
