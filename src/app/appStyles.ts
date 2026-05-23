import type { CalculatorTheme } from "../features/theme";
import { createCalculatorStyles } from "../features/calculator/styles/calculatorStyles";
import { createConversionStyles } from "../features/conversion/styles/conversionStyles";
import { createGraphingStyles } from "../features/graphing/styles/graphingStyles";
import { createDrawerStyles } from "../features/menu/styles/drawerStyles";
import { createNotesStyles } from "../features/notes/styles/notesStyles";
import { createThemeStyles } from "../features/theme/styles/themeStyles";
import { createLayoutStyles } from "../shared/styles/layoutStyles";

export function createAppStyles(theme: CalculatorTheme) {
  return {
    ...createLayoutStyles(theme),
    ...createCalculatorStyles(theme),
    ...createConversionStyles(theme),
    ...createGraphingStyles(theme),
    ...createNotesStyles(theme),
    ...createDrawerStyles(theme),
    ...createThemeStyles(),
  };
}
