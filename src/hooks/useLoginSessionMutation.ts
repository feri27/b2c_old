import {
  LoginSessionRes,
  createLoginSession,
} from '@/services/common/loginSession';
import { useMutation } from '@tanstack/react-query';

export function useLoginSessionMutation({
  onSuccess,
}: {
  onSuccess: (data: LoginSessionRes) => void;
}) {
  const { isLoading, mutate } = useMutation({
    mutationFn: createLoginSession,
    onSuccess,
  });
  return { isLoading, mutate };
}
