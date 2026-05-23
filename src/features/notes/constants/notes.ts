import type { NoteTool } from '../types';

export const utensilColors = ['#ffffff', '#1495ff', '#facc15', '#fb7185', '#34d399', '#a78bfa'];
export const maxPagesPerNote = 20;

export const trayTools: { tool: NoteTool; label: string }[] = [
  { tool: 'pen', label: 'Pen' },
  { tool: 'marker', label: 'Marker' },
  { tool: 'highlighter', label: 'Highlighter' },
  { tool: 'eraser', label: 'Eraser' },
  { tool: 'text', label: 'Text' },
];

export const noteDots = Array.from({ length: 360 }, (_, index) => ({
  id: index,
  left: (index % 24) * 18 + 12,
  top: Math.floor(index / 24) * 24 + 12,
}));

export const toolSettings: Record<Exclude<NoteTool, 'text'>, { label: string; icon: string; width: number }> = {
  pen: { label: 'Pen', icon: '/', width: 5 },
  marker: { label: 'Marker', icon: '//', width: 9 },
  highlighter: { label: 'Highlighter', icon: '▰', width: 16 },
  eraser: { label: 'Eraser', icon: '⌫', width: 24 },
};
