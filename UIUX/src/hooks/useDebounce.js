import { useState, useEffect } from 'react';

// ============================================================
// useDebounce — Tunda nilai input selama delay ms
// Digunakan pada search bar POS (300ms)
// ============================================================

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
