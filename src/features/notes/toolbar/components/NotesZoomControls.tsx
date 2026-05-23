import { Pressable, Text, View } from "react-native";

import type { NotesStyles } from "../../styles/notesStyleTypes";

type NotesZoomControlsProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  styles: NotesStyles;
  zoomScale: number;
};

export function NotesZoomControls({
  onZoomIn,
  onZoomOut,
  styles,
  zoomScale,
}: NotesZoomControlsProps) {
  return (
    <View style={styles.notesZoomControls}>
      <Pressable
        accessibilityLabel="Zoom out"
        accessibilityRole="button"
        onPress={onZoomOut}
        style={styles.notesZoomButton}
      >
        <Text style={styles.notesZoomButtonText}>−</Text>
      </Pressable>
      <Text style={styles.notesZoomScaleText}>{Math.round(zoomScale * 100)}%</Text>
      <Pressable
        accessibilityLabel="Zoom in"
        accessibilityRole="button"
        onPress={onZoomIn}
        style={styles.notesZoomButton}
      >
        <Text style={styles.notesZoomButtonText}>+</Text>
      </Pressable>
    </View>
  );
}
