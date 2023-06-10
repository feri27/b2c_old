import Cookies from 'js-cookie';
import { useLayoutEffect, useState } from 'react';

export function useAccessToken() {
  const [accessToken, setAccessToken] = useState('');
  useLayoutEffect(() => {
    const accessTkn = Cookies.get('accessToken');
    if (accessTkn) {
      setAccessToken(accessTkn);
    }
  }, []);
  return accessToken;
}
