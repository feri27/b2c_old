import { useEffect, useState } from 'react';

export default function CountdownText({
  count,
  isNote = false,
  cb,
}: {
  count: number;
  isNote?: boolean;
  cb?: () => void;
}) {
  const [countdown, setCountdown] = useState(count);

  useEffect(() => {
    if (!isNote && countdown === 0) {
      cb?.();
    }
  }, [countdown, cb, isNote]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 0) {
          clearInterval(timer);
          return prevCountdown;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);
  return isNote ? (
    <p>
      {' '}
      Please check your iSecure registered device and approve it within{' '}
      {countdown} {countdown === 0 ? 'second' : 'seconds'}.
    </p>
  ) : (
    <p>Continue with Transaction ({countdown}s)</p>
  );
}
