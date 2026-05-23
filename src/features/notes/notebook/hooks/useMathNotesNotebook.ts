import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

import { createId } from '../../../../shared/utils/ids';
import type { MathNote, NoteCollection, NotePage } from '../../types';
import { maxPagesPerNotebook } from '../constants/notebookLimits';
import { noteCollectionsStorageKey, notePagesStorageKey, notesStorageKey } from '../persistence/mathNotesStorage';
import { createBlankPage, createCollection, normalizeNoteCollection } from '../utils/createMathNotesNotebook';
import { isMathNote, isNoteCollection, isNotePage } from '../utils/validateMathNotesNotebook';

export function useMathNotesNotebook() {
  const [notes, setNotes] = useState<MathNote[]>([]);
  const [notesLoaded, setNotesLoaded] = useState(false);
  const [noteCollections, setNoteCollections] = useState<NoteCollection[]>(() => [createCollection(1)]);
  const [noteCollectionsLoaded, setNoteCollectionsLoaded] = useState(false);
  const [activeCollectionIndex, setActiveCollectionIndex] = useState(0);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [textDraft, setTextDraft] = useState('');

  const activeCollection = noteCollections[activeCollectionIndex] ?? noteCollections[0];
  const activePages = activeCollection?.pages ?? [];
  const activePage = activePages[activePageIndex] ?? activePages[0];

  useEffect(() => {
    AsyncStorage.getItem(notesStorageKey)
      .then((storedNotes) => {
        if (!storedNotes) {
          return;
        }

        const parsedNotes = JSON.parse(storedNotes);
        if (Array.isArray(parsedNotes)) {
          setNotes(parsedNotes.filter(isMathNote));
        }
      })
      .catch(() => undefined)
      .finally(() => setNotesLoaded(true));
  }, []);

  useEffect(() => {
    if (!notesLoaded) {
      return;
    }

    AsyncStorage.setItem(notesStorageKey, JSON.stringify(notes)).catch(() => undefined);
  }, [notes, notesLoaded]);

  useEffect(() => {
    AsyncStorage.getItem(noteCollectionsStorageKey)
      .then((storedCollections) => {
        if (!storedCollections) {
          return AsyncStorage.getItem(notePagesStorageKey);
        }

        const parsedCollections = JSON.parse(storedCollections);
        if (Array.isArray(parsedCollections)) {
          const validCollections = parsedCollections
            .filter(isNoteCollection)
            .map(normalizeNoteCollection);
          if (validCollections.length > 0) {
            setNoteCollections(validCollections);
            setActiveCollectionIndex(0);
            setActivePageIndex(0);
          }
        }

        return null;
      })
      .then((storedPages) => {
        if (!storedPages) {
          return;
        }

        const parsedPages = JSON.parse(storedPages);
        if (Array.isArray(parsedPages)) {
          const validPages = parsedPages.filter(isNotePage).slice(0, maxPagesPerNotebook);
          if (validPages.length > 0) {
            setNoteCollections([{
              id: createId('collection'),
              title: 'Math Notes 1',
              pageCount: validPages.length,
              pages: validPages,
              updatedAt: new Date().toISOString(),
            }]);
            setActiveCollectionIndex(0);
            setActivePageIndex(0);
          }
        }
      })
      .catch(() => undefined)
      .finally(() => setNoteCollectionsLoaded(true));
  }, []);

  useEffect(() => {
    if (!noteCollectionsLoaded) {
      return;
    }

    AsyncStorage.setItem(noteCollectionsStorageKey, JSON.stringify(noteCollections)).catch(() => undefined);
  }, [noteCollections, noteCollectionsLoaded]);

  function updateActivePage(updater: (page: NotePage) => NotePage) {
    setNoteCollections((current) => current.map((collection, collectionIndex) => {
      if (collectionIndex !== activeCollectionIndex) {
        return collection;
      }

      return {
        ...collection,
        pages: collection.pages.map((page, pageIndex) => (
          pageIndex === activePageIndex ? updater(page) : page
        )),
        updatedAt: new Date().toISOString(),
      };
    }));
  }

  function addPage() {
    setNoteCollections((current) => current.map((collection, collectionIndex) => {
      if (collectionIndex !== activeCollectionIndex) {
        return collection;
      }

      if (collection.pages.length >= maxPagesPerNotebook) {
        setActivePageIndex(maxPagesPerNotebook - 1);
        return collection;
      }

      setActivePageIndex(collection.pages.length);
      return {
        ...collection,
        pageCount: collection.pages.length + 1,
        pages: [...collection.pages, createBlankPage(collection.pages.length)],
        updatedAt: new Date().toISOString(),
      };
    }));
  }

  function deleteActivePage() {
    setNoteCollections((current) => current.map((collection, collectionIndex) => {
      if (collectionIndex !== activeCollectionIndex) {
        return collection;
      }

      if (collection.pages.length <= 1) {
        return {
          ...collection,
          pages: [createBlankPage(0)],
          pageCount: 1,
          updatedAt: new Date().toISOString(),
        };
      }

      const nextPages = collection.pages.filter((_, pageIndex) => pageIndex !== activePageIndex);
      setActivePageIndex((currentIndex) => Math.min(currentIndex, nextPages.length - 1));
      return {
        ...collection,
        pageCount: nextPages.length,
        pages: nextPages,
        updatedAt: new Date().toISOString(),
      };
    }));
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
      const nextCollection = createCollection(1, current.length);
      setActiveCollectionIndex(current.length);
      setActivePageIndex(0);
      onCreated?.();
      return [...current, nextCollection];
    });
  }

  function deleteCollection(collectionId: string) {
    setNoteCollections((current) => {
      const nextCollections = current.filter((collection) => collection.id !== collectionId);
      const resolvedCollections = nextCollections.length > 0 ? nextCollections : [createCollection(1)];
      setActiveCollectionIndex((currentIndex) => Math.min(currentIndex, resolvedCollections.length - 1));
      setActivePageIndex(0);
      return resolvedCollections;
    });
  }

  function saveNotebookSnapshot() {
    const pageCount = activePages.length.toString().padStart(2, '0');
    setNotes((current) => [
      {
        id: createId('note'),
        body: `Saved collection mock: ${activeCollection?.title ?? 'Math Notes'} (${pageCount} pages)`,
        savedAt: new Date().toISOString(),
      },
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
        {
          id: createId('text'),
          body,
          x: 32,
          y: 160 + page.textBlocks.length * 42,
        },
      ],
    }));
    setTextDraft('');
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
