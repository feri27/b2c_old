import { updateTransaction } from '@/services/transaction';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const useUpdateTxnMutation = () => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: updateTransaction,
    onSuccess: (data) => {
      console.log(data);
      router.push('/payment-fail');
    },
  });

  return {
    isLoading: mutation.isLoading,
    mutate: mutation.mutate,
  };
};
