export type ThemeId =
  | "green"
  | "red"
  | "pink"
  | "classic"
  | "blue"
  | "violet"
  | "teal"
  | "amber"
  | "slate"
  | "cream";

export type CalculatorTheme = {
  id: ThemeId;
  label: string;
  statusBar: "light" | "dark";
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
    graphBackground: string;
    graphGridLine: string;
    graphAxisLine: string;
    graphLabelText: string;
  };
};
