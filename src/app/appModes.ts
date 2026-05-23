export type AppMode = 'basic' | 'scientific' | 'graphing' | 'notes';
export type CalculatorMode = Extract<AppMode, 'basic' | 'scientific'>;
