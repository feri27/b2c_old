'use client';
import PaymentStatus from '@/components/b2b/PaymentStatus';
import { useAccessTokenAndChannel } from '@/hooks/useAccessTokenAndChannel';
import { useLogoutBMutation } from '@/hooks/useLogoutBMutation';
import { useTransactionDetail } from '@/hooks/useTransactionDetail';
import { useState } from 'react';

export default function PaymentFail() {
  const txnDetail = useTransactionDetail();
  const [accessToken, channel] = useAccessTokenAndChannel();
  const [isClicked, setIsClicked] = useState(false);
  const logouBMut = useLogoutBMutation(
    '/b2b/payment-details',
    'S',
    setIsClicked
  );
  const handleContinue = () => {
    logouBMut.mutate({ accessToken, channel, page: '/b2b/payment-fail' });
    setIsClicked(true);
  };

  return (
    <PaymentStatus
      cb={handleContinue}
      status="Cancel"
      tnxDetail={txnDetail}
      isLoading={isClicked}
    />
  );
}

/*

*/
