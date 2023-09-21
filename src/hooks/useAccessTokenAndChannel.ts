import { useEffect, useState } from 'react';

export function useAccessTokenAndChannel() {
  const [accessToken, setAccessToken] = useState('');
  const [channel, setChannel] = useState('');
  const [notifyAccessToken, setNotifyAccessToken] = useState('');
  useEffect(() => {
    const accessTkn = sessionStorage.getItem('accessToken');
    const chnl = sessionStorage.getItem('channel');
    const notifyAccessTkn = sessionStorage.getItem('notifyBAccessToken');
    if (accessTkn) {
      setAccessToken(accessTkn);
    }
    if (chnl) {
      setChannel(chnl);
    }
    if (notifyAccessTkn) {
      setNotifyAccessToken(notifyAccessTkn);
    }
  }, []);
  return [accessToken, channel, notifyAccessToken];
}
