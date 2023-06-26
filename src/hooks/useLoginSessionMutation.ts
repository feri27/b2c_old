import {
  LoginSessionRes,
  createLoginSession,
} from '@/services/common/loginSession';
import { useMutation } from '@tanstack/react-query';

export function useLoginSessionMutation({
  onSuccess,
  onError,
}: {
  onSuccess: (data: LoginSessionRes) => void;
  onError: (error: unknown) => void;
}) {
  const { isLoading, mutate } = useMutation({
    mutationFn: createLoginSession,
    onSuccess,
    onError,
  });
  return { isLoading, mutate };
}
