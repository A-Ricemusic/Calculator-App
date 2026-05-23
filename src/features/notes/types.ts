// Drawing
export type NoteTool = 'pen' | 'marker' | 'highlighter' | 'eraser' | 'text';

export type Point = {
  x: number;
  y: number;
};

export type Stroke = {
  id: string;
  color: string;
  tool: Exclude<NoteTool, 'text'>;
  width: number;
  points: Point[];
};

// Text
export type TextBlock = {
  id: string;
  body: string;
  x: number;
  y: number;
};

// Notebook
export type MathNote = {
  id: string;
  body: string;
  savedAt: string;
};

export type NotePage = {
  id: string;
  title: string;
  pencilKitData?: string;
  strokes: Stroke[];
  textBlocks: TextBlock[];
};

export type NoteCollection = {
  id: string;
  title: string;
  pageCount: number;
  pages: NotePage[];
  updatedAt: string;
};
