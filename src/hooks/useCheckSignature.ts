import { useEffect } from 'react';
import { MerchantData, useMerchantData } from './useMerchantData';
import {
  Reason,
  TransactionDetail,
  UpdTrxReq,
} from '@/services/common/transaction';
import { getSessionID } from '@/utils/helpers';
import { UseMutateFunction, useMutation } from '@tanstack/react-query';
import { verify } from 'crypto';
import { verifySignature } from '@/services/common/signAndVerifyMessage';
import { useTransactionDetail } from './useTransactionDetail';
import { useSetAtom } from 'jotai';
import { cancelTypeAtom } from '@/atoms';

export function useCheckSignature({
  cancel,
  updateTxnMut,
  channel,
}: {
  cancel: (
    reason: Reason,
    txnDetail: TransactionDetail | MerchantData | null | undefined
  ) => void;
  updateTxnMut: {
    isLoading: boolean;
    mutate: UseMutateFunction<any, unknown, UpdTrxReq, unknown>;
  };
  channel: string;
}) {
  const merchantData = useMerchantData();
  const txnDetail = useTransactionDetail();
  const setCancelType = useSetAtom(cancelTypeAtom);
  const verifySignatureMut = useMutation({
    mutationFn: verifySignature,
    onSuccess: (data) => {
      if (data.message === 'failed') {
        cancel('VF', merchantData);
      } else {
        const sessionID = getSessionID();
        updateTxnMut.mutate({
          dbtrAgt: merchantData.dbtrAgt,
          endToEndId: merchantData.endToEndId,
          gpsCoord: '',
          merchantId: merchantData.msgId,
          page: '/login',
          reason: 'VP',
          sessionID,
          channel,
          amount: txnDetail !== null ? txnDetail.amount.toString() : '',
          payerName: txnDetail?.payerName ?? '',
          cdtrAgtBIC: txnDetail?.cdtrAgtBIC ?? '',
          dbtrAcctId: txnDetail?.dbtrAcctId ?? '',
          dbtrAgtBIC: txnDetail?.dbtrAgtBIC ?? '',
        });
      }
    },
  });
  useEffect(() => {
    if (
      merchantData.endToEndIDSignature.populated &&
      merchantData.endToEndIDSignature.value !== ''
    ) {
      verifySignatureMut.mutate({
        signature: merchantData.endToEndIDSignature.value,
        message: merchantData.endToEndId,
      });
    } else if (
      merchantData.endToEndIDSignature.populated &&
      merchantData.endToEndIDSignature.value === ''
    ) {
      cancel('VF', merchantData);
      setCancelType('U');
    }
  }, [merchantData.endToEndIDSignature]);
}
