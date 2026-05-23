export type Mode = 'basic' | 'scientific' | 'notes' | 'graphing';
export type Operator = '+' | '-' | 'x' | '/' | 'xy';
export type Variant = 'utility' | 'operator' | 'number' | 'scientific';

export type ButtonConfig = {
  label: string;
  action?: string;
  variant?: Variant;
  wide?: boolean;
};
