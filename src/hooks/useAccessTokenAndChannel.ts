import { useEffect, useState } from 'react';

export function useAccessTokenAndChannel() {
  const [accessToken, setAccessToken] = useState('');
  const [channel, setChannel] = useState('');
  useEffect(() => {
    const accessTkn = sessionStorage.getItem('accessToken');
    const chnl = sessionStorage.getItem('channel');
    if (accessTkn) {
      setAccessToken(accessTkn);
    }
    if (chnl) {
      setChannel(chnl);
    }
  }, []);
  return [accessToken, channel];
}
