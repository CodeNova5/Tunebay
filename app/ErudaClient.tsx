'use client';

import { useEffect } from 'react';

export default function ErudaClient() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      (async () => {
        const mod = await import('eruda');
        const eruda = (mod as any).default ?? (mod as any);
        eruda.init?.();
      })();
    }
  }, []);

  return null; // nothing visible
}