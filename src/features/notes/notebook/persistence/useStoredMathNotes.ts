import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

import { createId } from "@shared/utils/ids";
import type { NoteCollection } from "../../types";
import { maxPagesPerNotebook } from "../constants/notebookLimits";
import { normalizeNoteCollection } from "../utils/createMathNotesNotebook";
import { isNoteCollection, isNotePage } from "../utils/validateMathNotesNotebook";
import { noteCollectionsStorageKey, notePagesStorageKey } from "./mathNotesStorage";

export function useStoredMathNotes(
  noteCollections: NoteCollection[],
  setNoteCollections: (collections: NoteCollection[]) => void,
) {
  const [noteCollectionsLoaded, setNoteCollectionsLoaded] = useState(false);

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
            setNoteCollections([
              {
                id: createId("collection"),
                title: "Math Notes 1",
                pageCount: validPages.length,
                pages: validPages,
                updatedAt: new Date().toISOString(),
              },
            ]);
          }
        }
      })
      .catch(() => undefined)
      .finally(() => setNoteCollectionsLoaded(true));
  }, [setNoteCollections]);

  useEffect(() => {
    if (!noteCollectionsLoaded) {
      return;
    }

    AsyncStorage.setItem(noteCollectionsStorageKey, JSON.stringify(noteCollections)).catch(
      () => undefined,
    );
  }, [noteCollections, noteCollectionsLoaded]);
}
