import { SetStateAction } from 'jotai';
import { Dispatch, useEffect, useState } from 'react';

export default function CountdownText({
  count,
  isNote = false,
  cb,
  controller,
  setTimerOff,
  mfaMethod,
  buttonClickCount,
}: {
  count: number;
  isNote?: boolean;
  cb?: () => void;
  controller?: AbortController;
  setTimerOff?: Dispatch<SetStateAction<boolean>>;
  mfaMethod?: 'SMS' | 'MO' | 'MA';
  buttonClickCount?: number;
}) {
  const [countdown, setCountdown] = useState(count);

  useEffect(() => {
    if (countdown === 0) {
      cb?.();
      setTimerOff?.(true);
    }
  }, [countdown]);

  useEffect(() => {
    setCountdown(count);
  }, [buttonClickCount]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (
          countdown === 0 &&
          (prevCountdown === 0 || controller?.signal.aborted)
        ) {
          clearInterval(timer);
          return prevCountdown;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [controller, countdown]);
  return isNote && mfaMethod === 'SMS' ? (
    <p>
      check your registered mobile device for 6-Digit SMS OTP and input it
      within {countdown} {countdown === 0 ? 'second' : 'seconds'}
    </p>
  ) : isNote && mfaMethod === 'MO' ? (
    <p>
      {' '}
      iSecure Device OTP have been sent to iRakyat for the approval. Transaction
      will expire in
      {countdown} {countdown === 0 ? 'second' : 'seconds'}.
    </p>
  ) : isNote && mfaMethod === 'MA' ? (
    <p>
      You will receive an iSecure notification on your iRakyat mobile app to
      approve or reject this transaction. Transaction will expire in {countdown}{' '}
      {countdown === 0 ? 'second' : 'seconds'}.
    </p>
  ) : (
    <p>Continue with Transaction ({countdown}s)</p>
  );
}
