import { Pressable, Text, View } from "react-native";

import type { NotesStyles } from "../../styles/notesStyleTypes";

type NotesHeaderProps = {
  activePageIndex: number;
  activePagesCount: number;
  onBack: () => void;
  onOpenManager: () => void;
  styles: NotesStyles;
  title: string;
};

export function NotesHeader({
  activePageIndex,
  activePagesCount,
  onBack,
  onOpenManager,
  styles,
  title,
}: NotesHeaderProps) {
  return (
    <View style={styles.notesHeader}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back to calculator"
        onPress={onBack}
        style={styles.notesBackBtn}
      >
        <Text style={styles.notesBackIcon}>‹</Text>
      </Pressable>
      <View style={styles.notesHeaderCenter}>
        <Text numberOfLines={1} style={styles.notesTitle}>
          {title}
        </Text>
      </View>
      <Text style={styles.notesPageBadge}>
        {(activePageIndex + 1).toString().padStart(2, "0")}/
        {activePagesCount.toString().padStart(2, "0")}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open notes manager"
        onPress={onOpenManager}
        style={styles.notesManagerBtn}
      >
        <Text style={styles.notesManagerIcon}>☷</Text>
      </Pressable>
    </View>
  );
}
