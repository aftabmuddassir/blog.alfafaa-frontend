import { useEffect, useState } from "react";

/**
 * Hook to detect when Zustand has finished hydrating from localStorage.
 * This prevents hydration mismatch issues with SSR.
 */
export function useHydration() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}
