import type { MathNote, NoteCollection, NotePage, Point, Stroke, TextBlock } from "../../types";

export function isMathNote(value: unknown): value is MathNote {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const note = value as Partial<MathNote>;
  return (
    typeof note.id === "string" && typeof note.body === "string" && typeof note.savedAt === "string"
  );
}

export function isPoint(value: unknown): value is Point {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const point = value as Partial<Point>;
  return typeof point.x === "number" && typeof point.y === "number";
}

export function isStroke(value: unknown): value is Stroke {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const stroke = value as Partial<Stroke>;
  return (
    typeof stroke.id === "string" &&
    typeof stroke.color === "string" &&
    typeof stroke.width === "number" &&
    Array.isArray(stroke.points) &&
    stroke.points.every(isPoint) &&
    (stroke.tool === "pen" ||
      stroke.tool === "marker" ||
      stroke.tool === "highlighter" ||
      stroke.tool === "eraser")
  );
}

export function isTextBlock(value: unknown): value is TextBlock {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const textBlock = value as Partial<TextBlock>;
  return (
    typeof textBlock.id === "string" &&
    typeof textBlock.body === "string" &&
    typeof textBlock.x === "number" &&
    typeof textBlock.y === "number"
  );
}

export function isNotePage(value: unknown): value is NotePage {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const page = value as Partial<NotePage>;
  return (
    typeof page.id === "string" &&
    typeof page.title === "string" &&
    (typeof page.pencilKitData === "undefined" || typeof page.pencilKitData === "string") &&
    Array.isArray(page.strokes) &&
    page.strokes.every(isStroke) &&
    Array.isArray(page.textBlocks) &&
    page.textBlocks.every(isTextBlock)
  );
}

export function isNoteCollection(value: unknown): value is NoteCollection {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const collection = value as Partial<NoteCollection>;
  return (
    typeof collection.id === "string" &&
    typeof collection.title === "string" &&
    typeof collection.pageCount === "number" &&
    typeof collection.updatedAt === "string" &&
    Array.isArray(collection.pages) &&
    collection.pages.length > 0 &&
    collection.pages.every(isNotePage)
  );
}
