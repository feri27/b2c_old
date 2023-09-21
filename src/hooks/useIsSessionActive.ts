import { SetStateAction } from 'jotai';
import { useRouter, usePathname } from 'next/navigation';
import { Dispatch, useEffect } from 'react';
import { useTransactionDetail } from './useTransactionDetail';

type SessionStatus = 'active' | 'expired' | undefined;

export function useIsSessionActive(cb: () => void, login = false) {
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
      console.log(txnDetail?.xpryDt);

      let expiryDate =
        txnDetail !== null ? new Date(txnDetail.xpryDt) : undefined;
      const xpryDTtime =
        expiryDate !== undefined
          ? Math.floor(expiryDate.getTime() / 1000)
          : undefined;
      const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000);
      console.log({
        sessionexpiry: currentTimeInSeconds - sessionExpiry,
        expdt:
          xpryDTtime != undefined
            ? currentTimeInSeconds - xpryDTtime
            : undefined,
      });
      if (login) {
        if (currentTimeInSeconds > sessionExpiry) {
          // setIsActive(false);
          cb();
        }
      } else {
        if (
          currentTimeInSeconds > sessionExpiry ||
          (xpryDTtime && currentTimeInSeconds > xpryDTtime)
        ) {
          // setIsActive(false);
          cb();
        }
      }
    }
  }, [txnDetail]);
}
