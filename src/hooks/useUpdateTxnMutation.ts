import { updateTransaction } from '@/services/transaction';
import { useMutation } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';

export const useUpdateTxnMutation = () => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: updateTransaction,
    onSuccess: (data) => {
      const urlres = JSON.parse(localStorage.getItem('urlres')!);
      localStorage.setItem(
        'urlres',
        JSON.stringify([
          ...urlres,
          { url: '/updatetransaction', method: 'POST', response: data },
        ])
      );
      router.push('/payment-fail');
    },
  });

  return {
    isLoading: mutation.isLoading,
    mutate: mutation.mutate,
  };
};
