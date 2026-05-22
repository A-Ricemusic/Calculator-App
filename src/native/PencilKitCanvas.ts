import { Platform, requireNativeComponent } from 'react-native';
import type { PencilKitCanvasProps } from '../types/native';

export const PencilKitCanvas = Platform.OS === 'ios'
  ? requireNativeComponent<PencilKitCanvasProps>('PencilKitCanvas')
  : null;
