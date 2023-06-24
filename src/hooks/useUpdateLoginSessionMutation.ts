import { initialSellerData, sellerDataAtom } from '@/atoms';
import { updateLoginSession } from '@/services/common/loginSession';
import { useMutation } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export function useUpdateLoginSessionMutation() {
  const router = useRouter();
  const setSellerData = useSetAtom(sellerDataAtom);
  const updateLoginSessionMut = useMutation({
    mutationFn: updateLoginSession,
    onSuccess: (data) => {
      if (
        data.message === 'success' ||
        data.message.includes('session not found') ||
        data.message.includes('privilege')
      ) {
        Cookies.remove('accessToken');
        Cookies.remove('channel');
        localStorage.removeItem('transactionDetail');
        localStorage.removeItem('loginData');
        localStorage.removeItem('loginBData');
        setSellerData(initialSellerData);
        Cookies.remove('sessionExpiry');
        Cookies.remove('sessionID');
        Cookies.set('sessionStatus', 'expired');
        Cookies.set('loginSessionStatus', 'expired');
        router.push('/');
      }
    },
  });
  return updateLoginSessionMut;
}
