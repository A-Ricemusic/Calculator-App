import { Text, View } from "react-native";

import type { AppStyles } from "../../../../app/appTypes";
import type { NoteTool } from "../../types";

type UtensilIconProps = {
  activeColor: string;
  isActive: boolean;
  styles: AppStyles;
  tool: NoteTool;
};

export function UtensilIcon({ activeColor, isActive, styles, tool }: UtensilIconProps) {
  const tint = isActive ? "#ffffff" : "rgba(255, 255, 255, 0.55)";
  const band = isActive ? activeColor : "rgba(255, 255, 255, 0.2)";

  if (tool === "pen") {
    return (
      <View style={styles.utensilWrap}>
        <View style={[styles.penTip, { borderBottomColor: tint }]} />
        <View style={[styles.penBarrel, { borderColor: band }]} />
        <View style={styles.penGrip} />
      </View>
    );
  }

  if (tool === "marker") {
    return (
      <View style={styles.utensilWrap}>
        <View style={[styles.markerNib, { backgroundColor: tint }]} />
        <View style={[styles.markerBarrel, { borderColor: band }]} />
      </View>
    );
  }

  if (tool === "highlighter") {
    return (
      <View style={styles.utensilWrap}>
        <View
          style={[
            styles.highlighterTip,
            { backgroundColor: isActive ? activeColor : "rgba(255,255,255,0.25)" },
          ]}
        />
        <View style={[styles.highlighterBarrel, { borderColor: band }]} />
      </View>
    );
  }

  if (tool === "eraser") {
    return (
      <View style={styles.utensilWrap}>
        <View style={styles.eraserTop} />
        <View style={styles.eraserBody} />
      </View>
    );
  }

  return (
    <View style={styles.utensilWrap}>
      <View style={[styles.textToolBox, { borderColor: tint }]}>
        <Text style={[styles.textToolLetter, { color: tint }]}>T</Text>
      </View>
    </View>
  );
}
