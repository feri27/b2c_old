import { LoginResBody } from '@/services/login';
import { useLayoutEffect, useState } from 'react';

export function useLoginData() {
  const [loginData, setLoginData] = useState<LoginResBody | null>(null);
  useLayoutEffect(() => {
    const storedLgData = localStorage.getItem('loginData');
    setLoginData(storedLgData ? JSON.parse(storedLgData) : null);
  }, []);
  return loginData;
}
