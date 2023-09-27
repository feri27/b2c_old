import { ResponseHeader } from '@/services/commonTypes';
import { MutateOptions } from '@tanstack/react-query';
import { useEffect } from 'react';
type MutateFn = (
  variables: {
    accessToken: string;
    channel: string;
    page: string;
    dbtrAgt: string;
  },
  options?:
    | MutateOptions<
        ResponseHeader,
        unknown,
        {
          accessToken: string;
          channel: string;
          page: string;
          dbtrAgt: string;
        },
        unknown
      >
    | undefined
) => void;
export function useLogoutOnBrowserClose(
  logout: MutateFn,
  options: {
    page: string;
    accessToken: string;
    dbtrAgt: string;
    logoutCalled: boolean;
  }
) {
  useEffect(() => {
    console.log('called');

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      if (options.accessToken && !options.logoutCalled) {
        logout({
          accessToken: options.accessToken,
          page: options.page,
          channel: 'B2B',
          dbtrAgt: options.dbtrAgt,
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [options.dbtrAgt, options.accessToken, options.page]);
}
