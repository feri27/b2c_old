import { useEffect, useState } from 'react';

export function useDebouncedValue(value: string) {
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchInput(value);
    }, 500);
    return () => clearTimeout(timeout);
  }, [value]);
  return searchInput;
}
