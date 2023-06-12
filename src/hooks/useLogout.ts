import { sellerDataAtom } from '@/atoms';
import { logout } from '@/services/logout';
import { useMutation } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export function useLogout() {
  const router = useRouter();
  const setSellerData = useSetAtom(sellerDataAtom);
  const { isLoading, mutate } = useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      Cookies.remove('accessToken');
      localStorage.removeItem('transactionDetail');
      localStorage.removeItem('loginData');
      setSellerData({ dbtrAgt: '', endToEndId: '' });
      router.push('/');
    },
  });
  return {
    isLoading,
    mutate,
  };
}
