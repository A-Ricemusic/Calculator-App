import type { Mode } from '../types/calculator';

export const menuItems: { label: string; icon: string; mode?: Mode }[] = [
  { label: 'Standard', icon: '+/-', mode: 'basic' },
  { label: 'Scientific', icon: '√x', mode: 'scientific' },
  { label: 'Math Notes', icon: '≡', mode: 'notes' },
];
