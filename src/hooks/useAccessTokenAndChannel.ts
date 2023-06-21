import Cookies from 'js-cookie';
import { useLayoutEffect, useState } from 'react';

export function useAccessTokenAndChannel() {
  const [accessToken, setAccessToken] = useState('');
  const [channel, setChannel] = useState('');
  useLayoutEffect(() => {
    const accessTkn = Cookies.get('accessToken');
    const chnl = Cookies.get('channel');
    if (accessTkn) {
      setAccessToken(accessTkn);
    }
    if (chnl) {
      setChannel(channel);
    }
  }, []);
  return [accessToken, channel];
}
