import { getMntLogs } from '@/services/maintenance';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useCheckMaintenaceTime(
  channel: 'B2C' | 'B2B',
  cb?: () => void
) {
  const mntLogQry = useQuery({
    queryKey: ['maintenance'],
    queryFn: getMntLogs,
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
  });
  const router = useRouter();
  useEffect(() => {
    const data = mntLogQry.data;
    if (data) {
      if (data && 'error' in data) {
        return;
      }
      const currentDate = new Date();
      const mntLogs = data.mntLogs.filter(
        (log) => log.iRakyatStatus === 'A' || log.iBizRakyatStatus === 'A'
      );
      for (const mntLog of mntLogs) {
        const { startDate, endDate, iBizRakyatStatus, iRakyatStatus } = mntLog;

        if (
          currentDate >= new Date(startDate) &&
          currentDate <= new Date(endDate)
        ) {
          if (channel === 'B2C' && iRakyatStatus === 'A') {
            router.push('/maintenance');
          } else if (channel === 'B2B' && iBizRakyatStatus === 'A') {
            router.push('/b2b/maintenance');
          }
        }
      }
      cb?.();
    }
  }, [mntLogQry.data]);
}
