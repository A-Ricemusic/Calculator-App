import { createId } from "@shared/utils/ids";
import type { NoteCollection, NotePage } from "../../types";
import { maxPagesPerNotebook } from "../constants/notebookLimits";

export function createBlankPage(index: number): NotePage {
  return {
    id: createId(`page-${index + 1}`),
    title: `Page ${index + 1}`,
    pencilKitData: "",
    strokes: [],
    textBlocks: [],
  };
}

export function createPages(count: number) {
  return Array.from({ length: count }, (_, index) => createBlankPage(index));
}

export function createCollection(pageCount: number, index = 0): NoteCollection {
  return {
    id: createId("collection"),
    title: `Math Notes ${index + 1}`,
    pageCount,
    pages: createPages(pageCount),
    updatedAt: new Date().toISOString(),
  };
}

export function normalizeNoteCollection(collection: NoteCollection): NoteCollection {
  const pages = collection.pages.slice(0, maxPagesPerNotebook);
  return {
    ...collection,
    pageCount: pages.length,
    pages,
  };
}
