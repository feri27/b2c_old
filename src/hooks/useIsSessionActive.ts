import { SetStateAction } from 'jotai';
import Cookies from 'js-cookie';
import { useRouter, usePathname } from 'next/navigation';
import { Dispatch, useLayoutEffect } from 'react';

type SessionStatus = 'active' | 'expired' | undefined;

export function useIsSessionActive(
  setIsActiver: Dispatch<SetStateAction<boolean>>
) {
  const pathName = usePathname();
  const router = useRouter();

  useLayoutEffect(() => {
    const sessExp = Cookies.get('sessionExpiry');
    const sessStatus = Cookies.get('sessionStatus') as SessionStatus;
    const loginSessStatus = Cookies.get('loginSessionStatus') as SessionStatus;
    if (
      !sessExp ||
      (sessExp && !sessStatus) ||
      (sessExp && sessStatus === 'expired') ||
      (sessExp && loginSessStatus === 'expired')
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
    } else if (loginSessStatus === 'active' || sessStatus === 'active') {
      const sessionExpiry = parseInt(sessExp);
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      if (currentTimeInSeconds > sessionExpiry) {
        setIsActiver(false);
      }
    }
  }, []);
}
