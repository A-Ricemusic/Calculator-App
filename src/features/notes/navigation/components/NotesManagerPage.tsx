import { Pressable, ScrollView, Text, View } from "react-native";

import type { NotesStyles } from "../../styles/notesStyleTypes";
import { maxPagesPerNotebook } from "../../notebook/constants/notebookLimits";
import type { NoteCollection } from "../../types";

type NotesManagerPageProps = {
  activeCollectionIndex: number;
  noteCollections: NoteCollection[];
  onClose: () => void;
  onCreateCollection: () => void;
  onDeleteCollection: (collectionId: string) => void;
  onOpenCollection: (collectionIndex: number) => void;
  styles: NotesStyles;
};

export function NotesManagerPage({
  activeCollectionIndex,
  noteCollections,
  onClose,
  onCreateCollection,
  onDeleteCollection,
  onOpenCollection,
  styles,
}: NotesManagerPageProps) {
  const notesCount = noteCollections.length;
  const totalPages = noteCollections.reduce(
    (total, collection) => total + collection.pages.length,
    0,
  );

  return (
    <View style={styles.notesManagerPage}>
      <View style={styles.notesManagerTopBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to active note"
          onPress={onClose}
          style={styles.notesManagerBackBtn}
        >
          <Text style={styles.notesManagerBackIcon}>‹</Text>
        </Pressable>
        <View style={styles.notesManagerHeading}>
          <Text style={styles.notesManagerEyebrow}>Library</Text>
          <Text style={styles.notesManagerTitle}>Math Notes</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Create new note"
          onPress={onCreateCollection}
          style={styles.notesManagerNewBtn}
        >
          <Text style={styles.notesManagerNewText}>+ Note</Text>
        </Pressable>
      </View>

      <View style={styles.notesManagerSummary}>
        <View style={styles.notesManagerSummaryItem}>
          <Text style={styles.notesManagerSummaryValue}>{notesCount}</Text>
          <Text style={styles.notesManagerSummaryLabel}>Notes</Text>
        </View>
        <View style={styles.notesManagerSummaryDivider} />
        <View style={styles.notesManagerSummaryItem}>
          <Text style={styles.notesManagerSummaryValue}>{totalPages}</Text>
          <Text style={styles.notesManagerSummaryLabel}>Pages</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.notesManagerList} style={styles.notesManagerScroll}>
        {noteCollections.map((collection, index) => {
          const isActive = index === activeCollectionIndex;

          return (
            <View
              key={collection.id}
              style={[styles.notesManagerItem, isActive && styles.notesManagerItemActive]}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                accessibilityLabel={`Open ${collection.title}`}
                onPress={() => onOpenCollection(index)}
                style={styles.notesManagerItemMain}
              >
                <View style={styles.notesManagerItemIcon}>
                  <Text style={styles.notesManagerItemIconText}>{index + 1}</Text>
                </View>
                <View style={styles.notesManagerItemCopy}>
                  <Text numberOfLines={1} style={styles.notesManagerItemTitle}>
                    {collection.title}
                  </Text>
                  <Text style={styles.notesManagerItemMeta}>
                    {collection.pages.length} of {maxPagesPerNotebook} pages
                  </Text>
                </View>
                {isActive && <Text style={styles.notesManagerActivePill}>Active</Text>}
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
          );
        })}
      </ScrollView>
    </View>
  );
}
