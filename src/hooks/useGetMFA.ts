import { useEffect, useState } from 'react';

export function useGetMFA() {
  const [mfa, setMfa] = useState<{ method: string; validity: number } | null>(
    null
  );
  useEffect(() => {
    const storedMfaData = sessionStorage.getItem('mfa');
    setMfa(storedMfaData ? JSON.parse(storedMfaData) : null);
  }, []);
  return mfa;
}
