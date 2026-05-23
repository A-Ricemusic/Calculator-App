import { Pressable, Text, TextInput, View } from "react-native";

import type { NotesStyles } from "../../styles/notesStyleTypes";

type TextEntryBarProps = {
  onAddTextBlock: () => void;
  onSetTextDraft: (text: string) => void;
  styles: NotesStyles;
  textDraft: string;
};

export function TextEntryBar({
  onAddTextBlock,
  onSetTextDraft,
  styles,
  textDraft,
}: TextEntryBarProps) {
  return (
    <View style={styles.notesTextBar}>
      <TextInput
        accessibilityLabel="Text to add to page"
        onChangeText={onSetTextDraft}
        placeholder="Type to add text…"
        placeholderTextColor="rgba(255,255,255,0.3)"
        style={styles.notesTextInput}
        value={textDraft}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add text"
        onPress={onAddTextBlock}
        style={styles.notesTextAddBtn}
      >
        <Text style={styles.notesTextAddLabel}>Add</Text>
      </Pressable>
    </View>
  );
}
