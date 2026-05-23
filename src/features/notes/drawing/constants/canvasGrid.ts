export const canvasGridDots = Array.from({ length: 360 }, (_, index) => ({
  id: index,
  left: (index % 24) * 18 + 12,
  top: Math.floor(index / 24) * 24 + 12,
}));
