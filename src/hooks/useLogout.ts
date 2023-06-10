import { logout } from '@/services/logout';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export function useLogout() {
  const router = useRouter();
  const { isLoading, mutate } = useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      Cookies.remove('accessToken');
      localStorage.removeItem('transactionDetail');
      localStorage.removeItem('loginData');
      router.push('/');
    },
  });
  return {
    isLoading,
    mutate,
  };
}
