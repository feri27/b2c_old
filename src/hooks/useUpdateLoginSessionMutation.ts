import { corporateLogonIDAtom, userIDAtom, usernameAtom } from '@/atoms';
import { updateLoginSession } from '@/services/common/loginSession';
import { useMutation } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { redirect, useRouter } from 'next/navigation';
import { useTransactionDetail } from './useTransactionDetail';
import { removeEverySessionStorageItem } from '@/utils/helpers';

export function useUpdateLoginSessionMutation() {
  const router = useRouter();
  const setUsername = useSetAtom(usernameAtom);
  const setUserID = useSetAtom(userIDAtom);
  const setCorporateLogonID = useSetAtom(corporateLogonIDAtom);
  const txnDetail = useTransactionDetail();
  const updateLoginSessionMut = useMutation({
    mutationFn: updateLoginSession,
    onSuccess: (data) => {
      const redirectURL = txnDetail?.redirectURL;
      setUsername('');
      setUserID('');
      setCorporateLogonID('');
      removeEverySessionStorageItem();

      window.location.href = redirectURL!;
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
  return updateLoginSessionMut;
}
