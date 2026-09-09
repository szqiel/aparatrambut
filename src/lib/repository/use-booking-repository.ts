'use client';

import { useEffect, useState } from 'react';
import { bookingRepository } from './local-storage-repository';

export function useBookingRepository() {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    bookingRepository.ensureSeeded();

    const handleStateChange = () => {
      setVersion((v) => v + 1);
    };

    window.addEventListener('aparatrambut_state_change', handleStateChange);
    window.addEventListener('storage', handleStateChange);

    return () => {
      window.removeEventListener('aparatrambut_state_change', handleStateChange);
      window.removeEventListener('storage', handleStateChange);
    };
  }, []);

  return {
    repository: bookingRepository,
    version,
    resetDemo: async () => {
      await bookingRepository.resetDemoData();
    },
  };
}
