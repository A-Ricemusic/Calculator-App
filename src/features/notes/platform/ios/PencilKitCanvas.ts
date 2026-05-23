import { Platform, UIManager, requireNativeComponent } from "react-native";
import type { PencilKitCanvasProps } from "./PencilKitCanvas.types";

const hasPencilKitCanvas =
  Platform.OS === "ios" && UIManager.getViewManagerConfig("PencilKitCanvas") != null;

export const PencilKitCanvas = hasPencilKitCanvas
  ? requireNativeComponent<PencilKitCanvasProps>("PencilKitCanvas")
  : null;
