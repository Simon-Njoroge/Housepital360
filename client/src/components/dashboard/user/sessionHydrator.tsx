'use client';

import { useEffect } from 'react';
import { hydrateAuthStoreFromCookie } from '@/store/authstore';

export default function SessionHydrator() {
  useEffect(() => {
    hydrateAuthStoreFromCookie();
  }, []);

  return null; // Invisible
}
