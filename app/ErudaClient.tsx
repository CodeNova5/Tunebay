'use client';

import { useEffect } from 'react';

export default function ErudaClient() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('eruda').then((eruda) => eruda.init());
    }
  }, []);

  return null; // nothing visible
}