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
  cb,
}: {
  cancel: (
    reason: Reason,
    txnDetail: TransactionDetail | MerchantData | null | undefined
  ) => void;
  cb: () => void;
}) {
  const merchantData = useMerchantData();
  const setCancelType = useSetAtom(cancelTypeAtom);
  const verifySignatureMut = useMutation({
    mutationFn: verifySignature,
    onSuccess: (data) => {
      if (data.message === 'failed') {
        cancel('VF', merchantData);
      } else {
        cb();
      }
    },
  });
  useEffect(() => {
    if (
      merchantData.endToEndIdSignature.populated &&
      merchantData.endToEndIdSignature.value !== ''
    ) {
      verifySignatureMut.mutate({
        signature: merchantData.endToEndIdSignature.value,
        message: merchantData.endToEndId,
      });
    } else if (
      merchantData.endToEndIdSignature.populated &&
      merchantData.endToEndIdSignature.value === ''
    ) {
      cancel('VF', merchantData);
      setCancelType('U');
    }
  }, [merchantData.endToEndIdSignature]);
}
