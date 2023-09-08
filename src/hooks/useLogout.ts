import { logout } from '@/services/logout';
import { useMutation } from '@tanstack/react-query';
import { useUpdateLoginSessionMutation } from './useUpdateLoginSessionMutation';
import { getSessionID, removeEverySessionStorageItem } from '@/utils/helpers';
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
      setIsClicked(false);
    },
  });
  return {
    isLoading,
    mutate,
  };
}
