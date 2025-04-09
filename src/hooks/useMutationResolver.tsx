'use client';

import { useEffect, useRef } from 'react';

export default function useWaitForChange<T>(state: T) {
  const resolveRef = useRef<((value: null) => void) | null>(null);

  useEffect(() => {
    if (!resolveRef.current) {
      return;
    }

    resolveRef.current(null);
    resolveRef.current = null;
  }, [state]);

  return () =>
    new Promise(res => {
      resolveRef.current = res;
    });
}
