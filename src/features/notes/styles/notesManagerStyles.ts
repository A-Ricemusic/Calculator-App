import { StyleSheet } from "react-native";

export function createNotesManagerStyles() {
  return {
    notesManagerOverlay: {
      ...StyleSheet.absoluteFillObject,
    },
    notesManagerScrim: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.56)",
    },
    notesManagerSheet: {
      backgroundColor: "#15181d",
      borderColor: "rgba(255, 255, 255, 0.1)",
      borderRadius: 14,
      borderWidth: 1,
      left: 10,
      maxHeight: "42%",
      paddingBottom: 12,
      paddingHorizontal: 14,
      paddingTop: 14,
      position: "absolute",
      right: 10,
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.38,
      shadowRadius: 18,
      top: 102,
      elevation: 10,
    },
    notesManagerHeader: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    notesManagerTitle: {
      color: "#ffffff",
      fontSize: 18,
      fontWeight: "800",
    },
    notesManagerNewBtn: {
      alignItems: "center",
      backgroundColor: "#3b82f6",
      borderRadius: 8,
      justifyContent: "center",
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    notesManagerNewText: {
      color: "#ffffff",
      fontSize: 13,
      fontWeight: "800",
    },
    notesManagerList: {
      gap: 8,
      paddingBottom: 2,
    },
    notesManagerItem: {
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.06)",
      borderColor: "rgba(255, 255, 255, 0.08)",
      borderRadius: 10,
      borderWidth: 1,
      flexDirection: "row",
      padding: 10,
    },
    notesManagerItemActive: {
      backgroundColor: "#22324f",
      borderColor: "#3b82f6",
    },
    notesManagerItemMain: {
      flex: 1,
      paddingRight: 10,
    },
    notesManagerItemTitle: {
      color: "#ffffff",
      fontSize: 15,
      fontWeight: "700",
    },
    notesManagerItemMeta: {
      color: "rgba(255, 255, 255, 0.5)",
      fontSize: 12,
      fontWeight: "600",
      marginTop: 3,
    },
    notesManagerDeleteBtn: {
      borderColor: "rgba(248, 113, 113, 0.42)",
      borderRadius: 8,
      borderWidth: 1,
      paddingHorizontal: 10,
      paddingVertical: 7,
    },
    notesManagerDeleteText: {
      color: "#fca5a5",
      fontSize: 12,
      fontWeight: "800",
    },
  } as const;
}
