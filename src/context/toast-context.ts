import { createContext } from 'react';
import type { AlertVariant } from '@/components/ui/Alert';

export type ToastVariant = Extract<
  AlertVariant,
  'info' | 'danger' | 'success' | 'warning' | 'neutral'
>;

export interface ToastItem {
  id: string;
  variant: ToastVariant;
  message: string;
  title?: string;
  durationMs: number;
}

export interface PushToastInput {
  variant?: ToastVariant;
  message: string;
  title?: string;
  durationMs?: number;
}

export interface ToastContextValue {
  toasts: ToastItem[];
  pushToast: (input: PushToastInput) => string;
  dismissToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export const DEFAULT_TOAST_DURATION_MS = 4000;
