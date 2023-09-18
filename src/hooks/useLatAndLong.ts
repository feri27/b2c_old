import { useEffect, useState } from 'react';

export function useLatAndLong() {
  const [latLong, setLatLong] = useState('');
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const lat = pos.coords.latitude;
        const long = pos.coords.longitude;
        setLatLong(`${lat} ${long}`);
      });
    }
  }, []);
  return latLong;
}
