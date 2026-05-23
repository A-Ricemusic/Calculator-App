import { Pressable, Text, View } from "react-native";

import type { AppStyles } from "@shared/styles/appTypes";
import { drawingTools } from "../../drawing/constants/drawingTools";
import type { NoteTool } from "../../types";
import { UtensilIcon } from "./UtensilIcon";

type NotesToolbarProps = {
  activeColor: string;
  activeTool: NoteTool;
  onToggleColorPicker: () => void;
  onSelectTool: (tool: NoteTool) => void;
  styles: AppStyles;
};

export function NotesToolbar({
  activeColor,
  activeTool,
  onToggleColorPicker,
  onSelectTool,
  styles,
}: NotesToolbarProps) {
  return (
    <View style={styles.notesBottomBar}>
      <View style={styles.notesToolRow}>
        {drawingTools.map(({ tool, label }) => {
          const isActive = activeTool === tool;
          return (
            <Pressable
              key={tool}
              accessibilityRole="button"
              accessibilityLabel={`Select ${tool}`}
              onPress={() => onSelectTool(tool)}
              style={[styles.notesToolBtn, isActive && styles.notesToolBtnActive]}
            >
              <UtensilIcon
                activeColor={activeColor}
                isActive={isActive}
                styles={styles}
                tool={tool}
              />
              <Text style={[styles.utensilLabel, isActive && styles.utensilLabelActive]}>
                {label}
              </Text>
            </Pressable>
          );
        })}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Pick color"
          onPress={onToggleColorPicker}
          style={styles.notesColorBtn}
        >
          <View style={[styles.notesColorBtnDot, { backgroundColor: activeColor }]} />
        </Pressable>
      </View>
    </View>
  );
}
