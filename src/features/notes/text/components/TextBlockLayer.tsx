import { Pressable, Text, View } from "react-native";

import type { AppStyles } from "../../../../app/appTypes";
import type { NoteTool, TextBlock } from "../../types";

type TextBlockLayerProps = {
  activeColor: string;
  activeTool: NoteTool;
  onDeleteTextBlock: (blockId: string) => void;
  styles: AppStyles;
  textBlocks: TextBlock[];
};

export function TextBlockLayer({
  activeColor,
  activeTool,
  onDeleteTextBlock,
  styles,
  textBlocks,
}: TextBlockLayerProps) {
  return (
    <>
      {textBlocks.map((textBlock) => (
        <View
          key={textBlock.id}
          style={[styles.canvasTextBlockWrap, { left: textBlock.x, top: textBlock.y }]}
        >
          <Text style={[styles.canvasTextBlock, { color: activeColor }]}>{textBlock.body}</Text>
          {activeTool === "text" && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Delete "${textBlock.body}"`}
              onPress={() => onDeleteTextBlock(textBlock.id)}
              style={styles.textBlockDelete}
            >
              <Text style={styles.textBlockDeleteIcon}>✕</Text>
            </Pressable>
          )}
        </View>
      ))}
    </>
  );
}
