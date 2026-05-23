import type { AppMode } from "../../../app/appModes";

export const menuItems: { label: string; icon: string; mode?: AppMode }[] = [
  { label: "Standard", icon: "+/-", mode: "basic" },
  { label: "Scientific", icon: "√x", mode: "scientific" },
  { label: "Conversion", icon: "↔", mode: "conversion" },
  { label: "Graphing", icon: "ƒ(x)", mode: "graphing" },
  { label: "Math Notes", icon: "≡", mode: "notes" },
];
