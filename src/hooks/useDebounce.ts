import { useState, useEffect } from 'react';

/**
 * Debounces a value by the given delay.
 * Used for search input to avoid API calls on every keystroke.
 * NFR-01: This is a key contributor to keeping UI < 100ms responsive.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
