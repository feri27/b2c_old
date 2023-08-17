import { getTransactionDetail } from '@/services/common/transaction';
import { useQuery } from '@tanstack/react-query';
import { MerchantData } from './useMerchantData';

export function useTransactionDetailQuery(
  merchantData: MerchantData,
  page: string,
  enabled?: boolean
) {
  const { isLoading, data } = useQuery({
    queryKey: ['getTransaction', merchantData.dbtrAgt, merchantData.endToEndId],
    queryFn: async () =>
      getTransactionDetail({
        endToEndId: merchantData.endToEndId,
        dbtrAgt: merchantData.dbtrAgt,
        page,
        channel: merchantData.channel,
      }),
    onSuccess: (data) => {
      if (data && data.data.amount) {
        sessionStorage.setItem('transactionDetail', JSON.stringify(data.data));
      }
    },
    enabled: enabled ?? true,
  });
  return { isLoading, data };
}
