import type { NativeSyntheticEvent } from "react-native";

export type PencilKitDrawingChangeEvent = {
  drawingData: string;
};

export type PencilKitCanvasProps = {
  drawingEnabled?: boolean;
  drawingData?: string;
  onDrawingChange?: (event: NativeSyntheticEvent<PencilKitDrawingChangeEvent>) => void;
  style?: object;
  toolPickerVisible?: boolean;
  zoomEnabled?: boolean;
  zoomScale?: number;
};
