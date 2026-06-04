import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

// ============================================================
// useAuth — Custom hook untuk AuthContext
// ============================================================

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam <AuthProvider>');
  }
  return context;
}
