import { useContext } from 'react';
import { UIContext } from '../contexts/UIContext';

// ============================================================
// useUI — Custom hook untuk UIContext
// ============================================================

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI harus digunakan di dalam <UIProvider>');
  }
  return context;
}
