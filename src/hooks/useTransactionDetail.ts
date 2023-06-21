import { TransactionDetail } from '@/services/common/transaction';
import { useLayoutEffect, useState } from 'react';

export function useTransactionDetail() {
  const [transactionDetail, setTransactionDetail] =
    useState<TransactionDetail | null>(null);
  useLayoutEffect(() => {
    const storedTnxData = localStorage.getItem('transactionDetail');
    console.log({ storedTnxData });

    setTransactionDetail(storedTnxData ? JSON.parse(storedTnxData) : null);
  }, []);
  return transactionDetail;
}
