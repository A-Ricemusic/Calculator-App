import { Pressable, Text } from "react-native";

import type { NotesStyles } from "../../styles/notesStyleTypes";

type NotesUtensilToggleProps = {
  isOpen: boolean;
  onToggle: () => void;
  styles: NotesStyles;
};

export function NotesUtensilToggle({ isOpen, onToggle, styles }: NotesUtensilToggleProps) {
  return (
    <Pressable
      accessibilityLabel={isOpen ? "Close drawing utensils" : "Open drawing utensils"}
      accessibilityRole="button"
      onPress={onToggle}
      style={[styles.notesUtensilToggle, isOpen && styles.notesUtensilToggleOpen]}
    >
      <Text style={styles.notesUtensilToggleIcon}>{isOpen ? "×" : "✎"}</Text>
    </Pressable>
  );
}
