import { privateKey } from '@/services/common/privateKey';
import { useQuery } from '@tanstack/react-query';

export function usePrivateKey({ enabled = true }: { enabled?: boolean }) {
  const { data, isLoading } = useQuery({
    queryKey: ['getPrivateKey'],
    queryFn: privateKey,
    refetchOnMount: false,
    enabled: enabled,
  });
  return {
    data,
    isLoading,
  };
}
