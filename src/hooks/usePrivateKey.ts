import { privateKey } from '@/services/common/privateKey';
import { useQuery } from '@tanstack/react-query';

export function usePrivateKey() {
  const { data, isLoading } = useQuery({
    queryKey: ['getPrivateKey'],
    queryFn: privateKey,
    refetchOnMount: false,
  });
  return {
    data,
    isLoading,
  };
}
