import { SetStateAction } from 'jotai';
import { useRouter, usePathname } from 'next/navigation';
import { Dispatch, useEffect } from 'react';
import { useTransactionDetail } from './useTransactionDetail';
import {
  checkSessionExpiry,
  getCurrentDateAndExpiryDates,
} from '@/utils/helpers';

type SessionStatus = 'active' | 'expired' | undefined;

export function useIsSessionActive(
  cb: () => void,
  login = false,
  channel: 'B2C' | 'B2B'
) {
  const pathName = usePathname();
  const router = useRouter();
  const txnDetail = useTransactionDetail();
  useEffect(() => {
    const sessExp = sessionStorage.getItem('sessionExpiry');
    const sessStatus = sessionStorage.getItem('sessionStatus') as SessionStatus;
    const loginSessStatus = sessionStorage.getItem(
      'loginSessionStatus'
    ) as SessionStatus;
    const loginPage = channel === 'B2B' ? '/b2b/loginb' : '/login';
    if (
      !sessExp ||
      (sessExp && !sessStatus) ||
      (sessExp && sessStatus === 'expired')
    ) {
      switch (pathName) {
        case '/login':
        case '/b2b/loginb':
        case '/maintenance':
          return;
        default:
          router.push(loginPage);
          return;
      }
    } else if (sessStatus === 'active' || loginSessStatus === 'active') {
      checkSessionExpiry(login, cb, txnDetail);
    }
  }, [txnDetail?.xpryDt]);
}
