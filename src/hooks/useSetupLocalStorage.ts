import React, { useEffect } from 'react';

export function useSetuplocalStorage() {
  useEffect(() => {
    const urlres = localStorage.getItem('urlres');
    if (!urlres) {
      localStorage.setItem('urlres', JSON.stringify([]));
    }
  }, []);
}
