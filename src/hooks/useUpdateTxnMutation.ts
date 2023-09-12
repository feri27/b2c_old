import { updateTransaction } from '@/services/common/transaction';
import { checkSystemLogout } from '@/utils/helpers';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const useUpdateTxnMutation = (
  navigate: boolean,
  navigateTo: string,
  channel: string,
  onSuccess?: (data: any) => void
) => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: updateTransaction,
    onSuccess:
      onSuccess ??
      ((data) => {
        if ('message' in data) {
          checkSystemLogout(data.message as string, router, 'B2B');
        } else {
          if (navigate) {
            router.push(navigateTo);
          }
        }
      }),
  });

  return {
    isLoading: mutation.isLoading,
    mutate: mutation.mutate,
  };
};
