import React, { useLayoutEffect } from 'react';

export function useSetuplocalStorage() {
  useLayoutEffect(() => {
    const urlres = localStorage.getItem('urlres');
    if (!urlres) {
      localStorage.setItem('urlres', JSON.stringify([]));
    }
  }, []);
}
