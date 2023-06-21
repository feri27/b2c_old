import { updateTransaction } from '@/services/common/transaction';
import { useMutation } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';

export const useUpdateTxnMutation = (navigate: boolean, navigateTo: string) => {
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
      if (navigate) {
        router.push(navigateTo);
      }
    },
  });

  return {
    isLoading: mutation.isLoading,
    mutate: mutation.mutate,
  };
};
