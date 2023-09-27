import { logout } from '@/services/logout';
import { useMutation } from '@tanstack/react-query';
import { useUpdateLoginSessionMutation } from './useUpdateLoginSessionMutation';
import { getSessionID, removeEverySessionStorageItem } from '@/utils/helpers';
import { Dispatch } from 'react';
import { SetStateAction, useSetAtom } from 'jotai';
import { logoutB } from '@/services/b2b/auth';
import { useTransactionDetail } from './useTransactionDetail';
import { corporateLogonIDAtom, userIDAtom, usernameAtom } from '@/atoms';

export function useLogoutBMutation(
  page: string,
  reason: 'C' | 'S',
  setIsClicked: Dispatch<SetStateAction<boolean>>
) {
  const updateLoginSessionMut = useUpdateLoginSessionMutation();
  const setUsername = useSetAtom(usernameAtom);
  const setUserID = useSetAtom(userIDAtom);
  const setCorporateLogonID = useSetAtom(corporateLogonIDAtom);
  const txnDetail = useTransactionDetail();
  const { isLoading, mutate } = useMutation({
    mutationFn: logoutB,
    onSuccess: (data) => {
      const sessionID = getSessionID();
      if (sessionID) {
        updateLoginSessionMut.mutate({
          status: 'expired',
          page,
          sessionID: sessionID!,
          reason,
        });
      } else {
        const redirectURL = txnDetail?.redirectURL;
        setUsername('');
        setUserID('');
        setCorporateLogonID('');
        removeEverySessionStorageItem();
        window.location.href = redirectURL!;
      }
    },
    onError: () => {
      const redirectURL = txnDetail?.redirectURL;
      setUsername('');
      setUserID('');
      setCorporateLogonID('');
      removeEverySessionStorageItem();
      window.location.href = redirectURL!;
    },
  });
  return {
    isLoading,
    mutate,
  };
}
