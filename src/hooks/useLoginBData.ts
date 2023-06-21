import { LoginBResBody } from '@/services/b2b/auth';
import { useLayoutEffect, useState } from 'react';

export function useLoginBData() {
  const [loginBData, setLoginBData] = useState<LoginBResBody | null>(null);
  useLayoutEffect(() => {
    const storedLgBData = localStorage.getItem('loginBData');
    setLoginBData(storedLgBData ? JSON.parse(storedLgBData) : null);
  }, []);
  return loginBData;
}
