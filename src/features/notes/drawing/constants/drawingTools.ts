import type { NoteTool } from "../../types";

export const utensilColors = ["#ffffff", "#1495ff", "#facc15", "#fb7185", "#34d399", "#a78bfa"];

export const drawingTools: { tool: NoteTool; label: string }[] = [
  { tool: "pen", label: "Pen" },
  { tool: "marker", label: "Marker" },
  { tool: "highlighter", label: "Highlighter" },
  { tool: "eraser", label: "Eraser" },
  { tool: "text", label: "Text" },
];

export const drawingToolSettings: Record<
  Exclude<NoteTool, "text">,
  { label: string; icon: string; width: number }
> = {
  pen: { label: "Pen", icon: "/", width: 5 },
  marker: { label: "Marker", icon: "//", width: 9 },
  highlighter: { label: "Highlighter", icon: "▰", width: 16 },
  eraser: { label: "Eraser", icon: "⌫", width: 24 },
};

export const minimumPointDistance: Record<Exclude<NoteTool, "text">, number> = {
  pen: 2,
  marker: 3,
  highlighter: 4,
  eraser: 4,
};
