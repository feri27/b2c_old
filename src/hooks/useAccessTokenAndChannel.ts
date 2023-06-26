import { useLayoutEffect, useState } from 'react';

export function useAccessTokenAndChannel() {
  const [accessToken, setAccessToken] = useState('');
  const [channel, setChannel] = useState('');
  useLayoutEffect(() => {
    const accessTkn = sessionStorage.getItem('accessToken');
    const chnl = sessionStorage.getItem('channel');
    if (accessTkn) {
      setAccessToken(accessTkn);
    }
    if (chnl) {
      setChannel(channel);
    }
  }, []);
  return [accessToken, channel];
}
