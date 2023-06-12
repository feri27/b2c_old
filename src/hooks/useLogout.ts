import { sellerDataAtom } from '@/atoms';
import { ResponseHeader } from '@/services/commonTypes';
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
      const urlres = JSON.parse(localStorage.getItem('urlres')!);
      localStorage.setItem(
        'urlres',
        JSON.stringify([
          ...urlres,
          { url: '/logout', method: 'POST', response: data },
        ])
      );
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
