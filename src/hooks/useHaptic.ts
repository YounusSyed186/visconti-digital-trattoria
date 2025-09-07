// src/hooks/useHaptic.ts
import { useCallback } from "react";

export default function useHaptic() {
  const feedback = useCallback((pattern: number | number[] = 50) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  }, []);

  return { feedback };
}
