import { GetTransactionDetail } from '@/services/common/transaction';
import { useEffect } from 'react';

export function useCheckTxnDetailXpry({
  data,
  cb1,
  cb2,
}: {
  data: GetTransactionDetail | undefined;
  cb1: () => void;
  cb2: () => void;
}) {
  useEffect(() => {
    if (data) {
      const expryDt = new Date(data.data.xpryDt);

      const xpryDTtime =
        expryDt !== undefined
          ? Math.floor(expryDt.getTime() / 1000)
          : undefined;
      const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000);

      if (xpryDTtime && currentTimeInSeconds > xpryDTtime) {
        cb1();
      } else {
        cb2();
      }
    }
  }, [data?.data.amount]);
}
