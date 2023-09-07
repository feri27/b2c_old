import { LoginBResBody } from '@/services/b2b/auth';
import { useEffect, useState } from 'react';

export function useLoginBData() {
  const [loginBData, setLoginBData] = useState<LoginBResBody | null>(null);
  useEffect(() => {
    const storedLgBData = sessionStorage.getItem('loginBData');
    setLoginBData(storedLgBData ? JSON.parse(storedLgBData) : null);
  }, []);
  return loginBData;
}
