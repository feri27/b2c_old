import { logout } from '@/services/logout';
import { useMutation } from '@tanstack/react-query';
import { useUpdateLoginSessionMutation } from './useUpdateLoginSessionMutation';
import { getSessionID } from '@/utils/helpers';
import { Dispatch } from 'react';
import { SetStateAction } from 'jotai';
import { logoutB } from '@/services/b2b/auth';

export function useLogoutBMutation(
  page: string,
  reason: 'C' | 'S',
  setIsClicked: Dispatch<SetStateAction<boolean>>
) {
  const updateLoginSessionMut = useUpdateLoginSessionMutation();

  const { isLoading, mutate } = useMutation({
    mutationFn: logoutB,
    onSuccess: (data) => {
      const sessionID = getSessionID();

      updateLoginSessionMut.mutate({
        status: 'expired',
        page,
        sessionID: sessionID!,
        reason,
      });
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
