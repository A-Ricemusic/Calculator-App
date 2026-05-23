import type { NativeSyntheticEvent } from "react-native";

export type PencilKitDrawingChangeEvent = {
  drawingData: string;
};

export type PencilKitCanvasProps = {
  drawingData?: string;
  onDrawingChange?: (event: NativeSyntheticEvent<PencilKitDrawingChangeEvent>) => void;
  style?: object;
  toolPickerVisible?: boolean;
};
