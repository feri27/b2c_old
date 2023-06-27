import { LoginResBody } from '@/services/login';
import { useEffect, useState } from 'react';

export function useLoginData() {
  const [loginData, setLoginData] = useState<LoginResBody | null>(null);
  useEffect(() => {
    const storedLgData = localStorage.getItem('loginData');
    setLoginData(storedLgData ? JSON.parse(storedLgData) : null);
  }, []);
  return loginData;
}
