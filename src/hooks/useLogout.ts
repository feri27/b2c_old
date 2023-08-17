import { logout } from '@/services/logout';
import { useMutation } from '@tanstack/react-query';
import { useUpdateLoginSessionMutation } from './useUpdateLoginSessionMutation';
import { getSessionID } from '@/utils/helpers';
import { Dispatch } from 'react';
import { SetStateAction, useSetAtom } from 'jotai';
import { redirect, useRouter } from 'next/navigation';
import { corporateLogonIDAtom, userIDAtom, usernameAtom } from '@/atoms';
import { useTransactionDetail } from './useTransactionDetail';

export function useLogout(
  page: string,
  reason: 'C' | 'S',
  setIsClicked: Dispatch<SetStateAction<boolean>>
) {
  const setUsername = useSetAtom(usernameAtom);
  const setUserID = useSetAtom(userIDAtom);
  const setCorporateLogonID = useSetAtom(corporateLogonIDAtom);
  const updateLoginSessionMut = useUpdateLoginSessionMutation();
  const txnDetail = useTransactionDetail();
  const { isLoading, mutate } = useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      const sessionID = getSessionID();
      if (sessionID)
        updateLoginSessionMut.mutate({
          status: 'expired',
          page,
          sessionID: sessionID!,
          reason,
        });
      else {
        const redirectURL = txnDetail?.redirectURL;
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('channel');
        sessionStorage.removeItem('transactionDetail');
        sessionStorage.removeItem('loginData');
        localStorage.removeItem('loginBData');
        sessionStorage.removeItem('merchantData');
        sessionStorage.removeItem('exp');
        setUsername('');
        setUserID('');
        setCorporateLogonID('');
        sessionStorage.removeItem('sessionExpiry');
        sessionStorage.removeItem('xpryDT');
        sessionStorage.removeItem('mfa');
        sessionStorage.setItem('sessionStatus', 'expired');
        sessionStorage.setItem('loginSessionStatus', 'expired');
        window.location.href = redirectURL!;
      }
    },
    onError: () => {
      setIsClicked(false);
    },
  });
  return {
    isLoading,
    mutate,
  };
}
