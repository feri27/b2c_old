import {
  corporateLogonIDAtom,
  initialSellerData,
  sellerDataAtom,
  userIDAtom,
  usernameAtom,
} from '@/atoms';
import { updateLoginSession } from '@/services/common/loginSession';
import { useMutation } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';

export function useUpdateLoginSessionMutation() {
  const router = useRouter();
  const setSellerData = useSetAtom(sellerDataAtom);
  const setUsername = useSetAtom(usernameAtom);
  const setUserID = useSetAtom(userIDAtom);
  const setCorporateLogonID = useSetAtom(corporateLogonIDAtom);
  const updateLoginSessionMut = useMutation({
    mutationFn: updateLoginSession,
    onSuccess: (data) => {
      if (
        data.message === 'success' ||
        data.message.includes('session not found') ||
        data.message.includes('privilege')
      ) {
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('channel');
        localStorage.removeItem('transactionDetail');
        localStorage.removeItem('loginData');
        localStorage.removeItem('loginBData');
        setSellerData(initialSellerData);
        setUsername('');
        setUserID('');
        setCorporateLogonID('');
        sessionStorage.removeItem('sessionExpiry');
        sessionStorage.removeItem('sessionID');
        sessionStorage.setItem('sessionStatus', 'expired');
        sessionStorage.setItem('loginSessionStatus', 'expired');
        router.push('/');
      }
    },
  });
  return updateLoginSessionMut;
}
