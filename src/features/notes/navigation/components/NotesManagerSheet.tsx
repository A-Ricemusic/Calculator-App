import { Pressable, ScrollView, Text, View } from "react-native";

import type { AppStyles } from "@shared/styles/appTypes";
import { maxPagesPerNotebook } from "../../notebook/constants/notebookLimits";
import type { NoteCollection } from "../../types";

type NotesManagerSheetProps = {
  activeCollectionIndex: number;
  noteCollections: NoteCollection[];
  onClose: () => void;
  onCreateCollection: () => void;
  onDeleteCollection: (collectionId: string) => void;
  onOpenCollection: (collectionIndex: number) => void;
  styles: AppStyles;
};

export function NotesManagerSheet({
  activeCollectionIndex,
  noteCollections,
  onClose,
  onCreateCollection,
  onDeleteCollection,
  onOpenCollection,
  styles,
}: NotesManagerSheetProps) {
  return (
    <View style={styles.notesManagerOverlay}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close notes manager"
        onPress={onClose}
        style={styles.notesManagerScrim}
      />
      <View style={styles.notesManagerSheet}>
        <View style={styles.notesManagerHeader}>
          <Text style={styles.notesManagerTitle}>Notes</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Create new note"
            onPress={onCreateCollection}
            style={styles.notesManagerNewBtn}
          >
            <Text style={styles.notesManagerNewText}>+ Note</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.notesManagerList}>
          {noteCollections.map((collection, index) => (
            <View
              key={collection.id}
              style={[
                styles.notesManagerItem,
                index === activeCollectionIndex && styles.notesManagerItemActive,
              ]}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: index === activeCollectionIndex }}
                accessibilityLabel={`Open ${collection.title}`}
                onPress={() => onOpenCollection(index)}
                style={styles.notesManagerItemMain}
              >
                <Text numberOfLines={1} style={styles.notesManagerItemTitle}>
                  {collection.title}
                </Text>
                <Text style={styles.notesManagerItemMeta}>
                  {collection.pages.length}/{maxPagesPerNotebook} pages
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Delete ${collection.title}`}
                onPress={() => onDeleteCollection(collection.id)}
                style={styles.notesManagerDeleteBtn}
              >
                <Text style={styles.notesManagerDeleteText}>Delete</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
