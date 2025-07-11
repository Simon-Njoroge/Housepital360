import React, { useEffect } from 'react';
import { hydrateAuthStoreFromLocalStorage } from '@/store/authstore';

const SessionHydrator: React.FC = () => {
  useEffect(() => {
    hydrateAuthStoreFromLocalStorage();
  }, []);

  return null; // No UI, just logic
};

export default SessionHydrator;