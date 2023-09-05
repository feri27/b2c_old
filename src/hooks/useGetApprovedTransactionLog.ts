import { getApprovedTransactioLog } from '@/services/transaction';
import { useQuery } from '@tanstack/react-query';

export function useGetApprovedTransactionLog() {
  const approvedTxnLogQry = useQuery({
    queryKey: ['approved-transaction-log'],
    queryFn: getApprovedTransactioLog,
    refetchOnWindowFocus: false,
  });
  return approvedTxnLogQry;
}
