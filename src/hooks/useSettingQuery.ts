import { retrieveSetting } from '@/services/common/setting';
import { sessionExpiryTime } from '@/utils/helpers';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export function useSettingQuery(
  channel: 'B2B' | 'B2C',
  page: string,
  enabled: boolean
) {
  const router = useRouter();
  const { isLoading, data } = useQuery({
    queryKey: ['setting'],
    queryFn: async () => retrieveSetting(page),
    onSuccess(data) {
      if (data && 'data' in data) {
        if (
          (channel === 'B2B' && data.data.maintain_b2b === 1) ||
          (channel === 'B2C' && data.data.maintain_b2c === 1)
        ) {
          router.push('/maintenance');
          return;
        }
        const sessExp = sessionStorage.getItem('sessionExpiry');
        if (!sessExp) {
          const sessionToBeExpiredIn = sessionExpiryTime(
            data.data.session_expiry
          );
          sessionStorage.setItem(
            'sessionExpiry',
            sessionToBeExpiredIn.toString()
          );
          sessionStorage.setItem('sessionStatus', 'active');
        }
      }
    },
    enabled: enabled,
  });
  return {
    isLoading,
    data,
  };
}
