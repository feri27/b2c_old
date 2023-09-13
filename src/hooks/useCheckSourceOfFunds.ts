import { Reason, TransactionDetail } from '@/services/common/transaction';
import { MerchantData } from './useMerchantData';
import { Dispatch, useEffect } from 'react';
import { SetStateAction } from 'jotai';
import { CancelType } from '@/atoms';

export function useCheckSourceOfFunds({
  transactionDetail,
  merchantData,
  setCancelType,
  cancel,
}: {
  transactionDetail: TransactionDetail | null;
  merchantData: MerchantData;
  setCancelType: Dispatch<SetStateAction<CancelType>>;
  cancel: (
    reason: Reason,
    txnDetail: TransactionDetail | MerchantData | null | undefined
  ) => void;
}) {
  useEffect(() => {
    const srcOfFundsFromMerData = merchantData?.accptblSrcOfFunds.split(',');
    const srcOfFundsFromtxnDetail = transactionDetail?.sourceOfFunds.split(',');
    let sameItems = false;
    srcOfFundsFromtxnDetail?.forEach((src) => {
      if (srcOfFundsFromMerData?.includes(src)) {
        sameItems = true;
      } else {
        sameItems = false;
      }
    });
    if (
      srcOfFundsFromMerData?.length !== srcOfFundsFromtxnDetail?.length ||
      !sameItems
    ) {
      setCancelType('FLD');
      cancel('ALF', transactionDetail);
    }
  }, [merchantData?.accptblSrcOfFunds, transactionDetail?.sourceOfFunds]);
}
