import { TransactionDetail } from '@/services/common/transaction';
import { useEffect, useState } from 'react';

export function useTransactionDetail() {
  const [transactionDetail, setTransactionDetail] =
    useState<TransactionDetail | null>(null);
  useEffect(() => {
    const storedTnxData = sessionStorage.getItem('transactionDetail');

    setTransactionDetail(storedTnxData ? JSON.parse(storedTnxData) : null);
  }, []);
  return transactionDetail;
}
