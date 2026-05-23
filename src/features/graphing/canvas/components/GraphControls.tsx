import { Pressable, Text, View } from "react-native";

import type { AppStyles } from "../../../../app/appTypes";

type GraphControlsProps = {
  onReset: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  styles: AppStyles;
};

export function GraphControls({ onReset, onZoomIn, onZoomOut, styles }: GraphControlsProps) {
  return (
    <View style={styles.graphControls}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Zoom in"
        onPress={onZoomIn}
        style={styles.graphControlButton}
      >
        <Text style={styles.graphControlText}>+</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Zoom out"
        onPress={onZoomOut}
        style={styles.graphControlButton}
      >
        <Text style={styles.graphControlText}>−</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Reset graph"
        onPress={onReset}
        style={styles.graphControlButton}
      >
        <Text style={[styles.graphControlText, { fontSize: 15 }]}>⌂</Text>
      </Pressable>
    </View>
  );
}
