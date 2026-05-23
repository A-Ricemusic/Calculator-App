import { StyleSheet } from "react-native";

export function createNotesCanvasStyles() {
  return {
    notesCanvasWrap: {
      borderColor: "rgba(255, 255, 255, 0.06)",
      borderRadius: 12,
      borderWidth: 1,
      flex: 1,
      marginHorizontal: 10,
      marginTop: 6,
      overflow: "hidden",
    },
    notesCanvas: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "#121418",
    },
    notesDot: {
      backgroundColor: "rgba(255, 255, 255, 0.07)",
      borderRadius: 999,
      height: 1.5,
      position: "absolute",
      width: 1.5,
    },
    strokeSegment: {
      borderRadius: 999,
      position: "absolute",
      transformOrigin: "left center",
    },
    canvasTextBlockWrap: {
      alignItems: "flex-start",
      flexDirection: "row",
      position: "absolute",
    },
    canvasTextBlock: {
      backgroundColor: "rgba(15, 17, 21, 0.72)",
      borderColor: "rgba(255, 255, 255, 0.1)",
      borderRadius: 8,
      borderWidth: StyleSheet.hairlineWidth,
      fontSize: 22,
      fontWeight: "600",
      maxWidth: 280,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    textBlockDelete: {
      alignItems: "center",
      backgroundColor: "#ef4444",
      borderRadius: 999,
      height: 20,
      justifyContent: "center",
      marginLeft: -10,
      marginTop: -6,
      width: 20,
    },
    textBlockDeleteIcon: {
      color: "#ffffff",
      fontSize: 10,
      fontWeight: "700",
    },
    notesTextBar: {
      alignItems: "center",
      backgroundColor: "#1a1d22",
      borderColor: "rgba(255, 255, 255, 0.08)",
      borderRadius: 10,
      borderWidth: 1,
      flexDirection: "row",
      gap: 6,
      marginHorizontal: 10,
      marginTop: 6,
      padding: 5,
    },
    notesTextInput: {
      color: "#ffffff",
      flex: 1,
      fontSize: 14,
      minHeight: 32,
      paddingHorizontal: 10,
    },
    notesTextAddBtn: {
      alignItems: "center",
      backgroundColor: "#3b82f6",
      borderRadius: 6,
      justifyContent: "center",
      minHeight: 32,
      paddingHorizontal: 14,
    },
    notesTextAddLabel: {
      color: "#ffffff",
      fontSize: 14,
      fontWeight: "700",
    },
  } as const;
}
