import { logout } from '@/services/logout';
import { useMutation } from '@tanstack/react-query';
import { useUpdateLoginSessionMutation } from './useUpdateLoginSessionMutation';
import { getSessionID } from '@/utils/helpers';

export function useLogoutBMutation(page: string, reason: 'C' | 'S') {
  const updateLoginSessionMut = useUpdateLoginSessionMutation();

  const { isLoading, mutate } = useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      const urlres = JSON.parse(localStorage.getItem('urlres')!);
      localStorage.setItem(
        'urlres',
        JSON.stringify([
          ...urlres,
          { url: '/logout', method: 'POST', response: data },
        ])
      );

      const sessionID = getSessionID();
      console.log({ sessionID });

      updateLoginSessionMut.mutate({
        status: 'expired',
        page,
        sessionID: sessionID!,
        reason,
      });
    },
  });
  return {
    isLoading,
    mutate,
  };
}
