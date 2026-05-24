import { createId } from "@shared/utils/ids";
import type { NoteCollection, NotePage } from "../../types";
import { maxPagesPerNotebook } from "../constants/notebookLimits";
import { createBlankPage, createCollection } from "./createMathNotesNotebook";

export function updateCollectionPage(
  collections: NoteCollection[],
  activeCollectionIndex: number,
  activePageIndex: number,
  updater: (page: NotePage) => NotePage,
) {
  return collections.map((collection, collectionIndex) => {
    if (collectionIndex !== activeCollectionIndex) {
      return collection;
    }

    return {
      ...collection,
      pages: collection.pages.map((page, pageIndex) =>
        pageIndex === activePageIndex ? updater(page) : page,
      ),
      updatedAt: new Date().toISOString(),
    };
  });
}

export function addPageToCollection(collection: NoteCollection) {
  if (collection.pages.length >= maxPagesPerNotebook) {
    return collection;
  }

  return {
    ...collection,
    pageCount: collection.pages.length + 1,
    pages: [...collection.pages, createBlankPage(collection.pages.length)],
    updatedAt: new Date().toISOString(),
  };
}

export function deletePageFromCollection(collection: NoteCollection, activePageIndex: number) {
  if (collection.pages.length <= 1) {
    return {
      ...collection,
      pages: [createBlankPage(0)],
      pageCount: 1,
      updatedAt: new Date().toISOString(),
    };
  }

  const nextPages = collection.pages.filter((_, pageIndex) => pageIndex !== activePageIndex);
  return {
    ...collection,
    pageCount: nextPages.length,
    pages: nextPages,
    updatedAt: new Date().toISOString(),
  };
}

export function createNextCollection(collectionCount: number) {
  return createCollection(1, collectionCount);
}

export function ensureCollectionExists(collections: NoteCollection[]) {
  return collections.length > 0 ? collections : [createCollection(1)];
}

export function createTextBlock(body: string, textBlockCount: number) {
  return {
    id: createId("text"),
    body,
    x: 32,
    y: 160 + textBlockCount * 42,
  };
}
