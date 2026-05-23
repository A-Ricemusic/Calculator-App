import { useCallback, useState } from "react";

import type { MathNote, NoteCollection, NotePage } from "../../types";
import { maxPagesPerNotebook } from "../constants/notebookLimits";
import { useStoredMathNotes } from "../persistence/useStoredMathNotes";
import {
  addPageToCollection,
  createNextCollection,
  createNotebookSnapshot,
  createTextBlock,
  deletePageFromCollection,
  ensureCollectionExists,
  updateCollectionPage,
} from "../utils/notebookActions";
import { createCollection } from "../utils/createMathNotesNotebook";

export function useMathNotesNotebook() {
  const [notes, setNotes] = useState<MathNote[]>([]);
  const [noteCollections, setNoteCollections] = useState<NoteCollection[]>(() => [
    createCollection(1),
  ]);
  const [activeCollectionIndex, setActiveCollectionIndex] = useState(0);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [textDraft, setTextDraft] = useState("");

  const activeCollection = noteCollections[activeCollectionIndex] ?? noteCollections[0];
  const activePages = activeCollection?.pages ?? [];
  const activePage = activePages[activePageIndex] ?? activePages[0];

  const replaceNotes = useCallback((nextNotes: MathNote[]) => setNotes(nextNotes), []);
  const replaceNoteCollections = useCallback((nextCollections: NoteCollection[]) => {
    setNoteCollections(nextCollections);
    setActiveCollectionIndex(0);
    setActivePageIndex(0);
  }, []);

  useStoredMathNotes(notes, noteCollections, replaceNotes, replaceNoteCollections);

  function updateActivePage(updater: (page: NotePage) => NotePage) {
    setNoteCollections((current) =>
      updateCollectionPage(current, activeCollectionIndex, activePageIndex, updater),
    );
  }

  function addPage() {
    setNoteCollections((current) =>
      current.map((collection, collectionIndex) => {
        if (collectionIndex !== activeCollectionIndex) {
          return collection;
        }

        const nextCollection = addPageToCollection(collection);
        if (nextCollection === collection) {
          setActivePageIndex(maxPagesPerNotebook - 1);
          return collection;
        }

        setActivePageIndex(collection.pages.length);
        return nextCollection;
      }),
    );
  }

  function deleteActivePage() {
    setNoteCollections((current) =>
      current.map((collection, collectionIndex) => {
        if (collectionIndex !== activeCollectionIndex) {
          return collection;
        }

        const nextCollection = deletePageFromCollection(collection, activePageIndex);
        setActivePageIndex((currentIndex) =>
          Math.min(currentIndex, nextCollection.pages.length - 1),
        );
        return nextCollection;
      }),
    );
  }

  function changePage(direction: -1 | 1) {
    setActivePageIndex((current) => {
      const nextIndex = current + direction;
      return Math.min(Math.max(nextIndex, 0), activePages.length - 1);
    });
  }

  function selectCollection(collectionIndex: number) {
    setActiveCollectionIndex(collectionIndex);
    setActivePageIndex(0);
  }

  function createNewCollection(onCreated?: () => void) {
    setNoteCollections((current) => {
      const nextCollection = createNextCollection(current.length);
      setActiveCollectionIndex(current.length);
      setActivePageIndex(0);
      onCreated?.();
      return [...current, nextCollection];
    });
  }

  function deleteCollection(collectionId: string) {
    setNoteCollections((current) => {
      const nextCollections = current.filter((collection) => collection.id !== collectionId);
      const resolvedCollections = ensureCollectionExists(nextCollections);
      setActiveCollectionIndex((currentIndex) =>
        Math.min(currentIndex, resolvedCollections.length - 1),
      );
      setActivePageIndex(0);
      return resolvedCollections;
    });
  }

  function saveNotebookSnapshot() {
    setNotes((current) => [
      createNotebookSnapshot(activeCollection, activePages.length),
      ...current,
    ]);
  }

  function addTextBlock() {
    const body = textDraft.trim();

    if (!body) {
      return;
    }

    updateActivePage((page) => ({
      ...page,
      textBlocks: [
        ...page.textBlocks,
        createTextBlock(body, page.textBlocks.length),
      ],
    }));
    setTextDraft("");
  }

  function deleteTextBlock(blockId: string) {
    updateActivePage((page) => ({
      ...page,
      textBlocks: page.textBlocks.filter((tb) => tb.id !== blockId),
    }));
  }

  function updatePencilKitDrawing(drawingData: string) {
    updateActivePage((page) => ({
      ...page,
      pencilKitData: drawingData,
    }));
  }

  return {
    activeCollection,
    activeCollectionIndex,
    activePage,
    activePageIndex,
    activePages,
    addPage,
    addTextBlock,
    changePage,
    createNewCollection,
    deleteCollection,
    deleteActivePage,
    deleteTextBlock,
    noteCollections,
    saveNotebookSnapshot,
    selectCollection,
    setTextDraft,
    textDraft,
    updateActivePage,
    updatePencilKitDrawing,
  };
}
