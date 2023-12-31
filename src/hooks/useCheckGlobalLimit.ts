import {
  GetTransactionDetail,
  Reason,
  TransactionDetail,
} from '@/services/common/transaction';
import { TxnLog } from '@/services/transaction';
import { Dispatch, useEffect } from 'react';
import { MerchantData } from './useMerchantData';
import { SetStateAction, useSetAtom } from 'jotai';
import { cancelTypeAtom } from '@/atoms';

export function useCheckGlobalLimit(
  txnDetail: GetTransactionDetail | undefined,
  approvedTxnLog:
    | {
        txnLog: TxnLog;
      }
    | {
        error: string;
      }
    | undefined,
  cancel: (
    reason: Reason,
    txnDetail: TransactionDetail | MerchantData | null | undefined
  ) => void,
  channel: 'B2B' | 'B2C',
  setFetchSettings: Dispatch<SetStateAction<boolean>>
) {
  const setCancelType = useSetAtom(cancelTypeAtom);
  useEffect(() => {
    if (
      txnDetail?.data &&
      (txnDetail.data.status === 'ACTC' || txnDetail?.data.status === 'ACSP') &&
      approvedTxnLog &&
      'txnLog' in approvedTxnLog
    ) {
      if (channel === 'B2C') {
        if (
          (/Mobi/i.test(navigator.userAgent) &&
            txnDetail.data.amount > approvedTxnLog.txnLog.nRMB) ||
          (!/Mobi/i.test(navigator.userAgent) &&
            txnDetail.data.amount > approvedTxnLog.txnLog.nRIB)
        ) {
          setCancelType('GL');
          cancel('GL', txnDetail.data);
        } else {
          setFetchSettings(true);
        }
      } else if (channel === 'B2B') {
        if (
          (/Mobi/i.test(navigator.userAgent) &&
            txnDetail.data.amount > approvedTxnLog.txnLog.nCMB) ||
          (!/Mobi/i.test(navigator.userAgent) &&
            txnDetail.data.amount > approvedTxnLog.txnLog.nCIB)
        ) {
          setCancelType('GL');
          cancel('GL', txnDetail.data);
        } else {
          setFetchSettings(true);
        }
      }
    }
  }, [approvedTxnLog, txnDetail?.data]);
}
