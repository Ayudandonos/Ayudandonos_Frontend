import type { ICONS } from './icons';

export type IconName = keyof typeof ICONS;

export const ICON_SIZE_PX = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
  '2xl': 32,
} as const;

export type IconSize = keyof typeof ICON_SIZE_PX;
