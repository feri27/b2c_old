'use client';
import { cancelTypeAtom } from '@/atoms';
import PaymentStatus from '@/components/b2b/PaymentStatus';
import { useAccessTokenAndChannel } from '@/hooks/useAccessTokenAndChannel';
import { useLogoutBMutation } from '@/hooks/useLogoutBMutation';
import { useTransactionDetail } from '@/hooks/useTransactionDetail';
import { useAtomValue } from 'jotai';
import { useState } from 'react';

export default function PaymentFail() {
  const txnDetail = useTransactionDetail();
  const [accessToken, channel] = useAccessTokenAndChannel();
  const [isClicked, setIsClicked] = useState(false);
  const cancelType = useAtomValue(cancelTypeAtom);

  const logouBMut = useLogoutBMutation(
    '/b2b/payment-details',
    'S',
    setIsClicked
  );
  const handleContinue = () => {
    logouBMut.mutate({ accessToken, channel, page: '/b2b/payment-fail' });
    setIsClicked(true);
  };
  const status =
    cancelType === ''
      ? ''
      : cancelType === 'TO'
      ? 'Unsuccessful - Transaction has encountered timeout error'
      : cancelType === 'EXP'
      ? 'Unsuccessful - Transaction has expired'
      : cancelType === 'FLD'
      ? 'Unsuccessful - Transaction has been rejected'
      : 'Unsuccessful - Transaction has been canceled';
  return (
    <PaymentStatus
      cb={handleContinue}
      status={status}
      tnxDetail={txnDetail}
      isLoading={isClicked}
    />
  );
}

/*

*/
