import type { createCalculatorStyles } from '../features/calculator/styles/calculatorStyles';
import type { createGraphingStyles } from '../features/graphing/styles/graphingStyles';
import type { createDrawerStyles } from '../features/menu/styles/drawerStyles';
import type { createNotesStyles } from '../features/notes/styles/notesStyles';
import type { createThemeStyles } from '../features/theme/styles/themeStyles';
import type { createLayoutStyles } from '../shared/styles/layoutStyles';

export type AppStyles = ReturnType<typeof createLayoutStyles>
  & ReturnType<typeof createCalculatorStyles>
  & ReturnType<typeof createGraphingStyles>
  & ReturnType<typeof createNotesStyles>
  & ReturnType<typeof createDrawerStyles>
  & ReturnType<typeof createThemeStyles>;
