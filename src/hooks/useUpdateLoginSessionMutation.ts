import { corporateLogonIDAtom, userIDAtom, usernameAtom } from '@/atoms';
import { updateLoginSession } from '@/services/common/loginSession';
import { useMutation } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { redirect, useRouter } from 'next/navigation';
import { useTransactionDetail } from './useTransactionDetail';

export function useUpdateLoginSessionMutation() {
  const router = useRouter();
  const setUsername = useSetAtom(usernameAtom);
  const setUserID = useSetAtom(userIDAtom);
  const setCorporateLogonID = useSetAtom(corporateLogonIDAtom);
  const txnDetail = useTransactionDetail();
  const updateLoginSessionMut = useMutation({
    mutationFn: updateLoginSession,
    onSuccess: (data) => {
      if (
        data.message === 'success' ||
        data.message.includes('session not found') ||
        data.message.includes('privilege')
      ) {
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
        sessionStorage.removeItem('sessionID');
        sessionStorage.removeItem('mfa');
        sessionStorage.setItem('sessionStatus', 'expired');
        sessionStorage.setItem('loginSessionStatus', 'expired');
        window.location.href = redirectURL!;
      }
    },
  });
  return updateLoginSessionMut;
}
