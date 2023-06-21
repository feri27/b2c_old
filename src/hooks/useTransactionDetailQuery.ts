import { SellerData } from '@/atoms';
import { getTransactionDetail } from '@/services/common/transaction';
import { useQuery } from '@tanstack/react-query';

export function useTransactionDetailQuery(
  sellerData: SellerData,
  page: string
) {
  const { isLoading, data } = useQuery({
    queryKey: ['getTransaction', sellerData.dbtrAgt, sellerData.endToEndId],
    queryFn: async () =>
      getTransactionDetail({
        endToEndId: sellerData.endToEndId,
        dbtrAgt: sellerData.dbtrAgt,
        page,
      }),
    onSuccess: (data) => {
      localStorage.setItem('transactionDetail', JSON.stringify(data.data));
    },
  });
  return { isLoading, data };
}
