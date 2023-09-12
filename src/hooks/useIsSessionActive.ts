import { SetStateAction } from 'jotai';
import { useRouter, usePathname } from 'next/navigation';
import { Dispatch, useEffect } from 'react';
import { useTransactionDetail } from './useTransactionDetail';

type SessionStatus = 'active' | 'expired' | undefined;

export function useIsSessionActive(cb: () => void) {
  const pathName = usePathname();
  const router = useRouter();
  const txnDetail = useTransactionDetail();
  useEffect(() => {
    const sessExp = sessionStorage.getItem('sessionExpiry');
    const sessStatus = sessionStorage.getItem('sessionStatus') as SessionStatus;
    const loginSessStatus = sessionStorage.getItem(
      'loginSessionStatus'
    ) as SessionStatus;
    if (
      !sessExp ||
      (sessExp && !sessStatus) ||
      (sessExp && sessStatus === 'expired')
    ) {
      switch (pathName) {
        case '/':
        case '/login':
        case '/b2b/loginb':
        case '/maintenance':
        case '/secure-phrase':
          return;
        default:
          router.push('/');
          return;
      }
    } else if (sessStatus === 'active' || loginSessStatus === 'active') {
      const sessionExpiry = parseInt(sessExp);

      const xpryDTtime =
        txnDetail !== null
          ? Math.floor(new Date(`${txnDetail.xpryDt}:00.000Z`).getTime() / 1000)
          : undefined;
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      console.log({
        xpryDTtimebool:
          currentTimeInSeconds > sessionExpiry ||
          (xpryDTtime && currentTimeInSeconds > xpryDTtime),
      });
      console.log({ xpryDTtime });

      if (
        currentTimeInSeconds > sessionExpiry ||
        (xpryDTtime && currentTimeInSeconds > xpryDTtime)
      ) {
        // setIsActive(false);
        cb();
      }
    }
  }, [txnDetail]);
}
