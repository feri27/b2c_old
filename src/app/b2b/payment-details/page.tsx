'use client';
import PaymentStatus from '@/components/b2b/PaymentStatus';
import { useAccessTokenAndChannel } from '@/hooks/useAccessTokenAndChannel';
import { useLogoutBMutation } from '@/hooks/useLogoutBMutation';
import { useTransactionDetail } from '@/hooks/useTransactionDetail';
import { useState } from 'react';

export default function PaymentDetails() {
  const txnDetail = useTransactionDetail();
  const [accessToken, channel] = useAccessTokenAndChannel();
  const [isClicked, setIsClicked] = useState(false);
  const logouBMut = useLogoutBMutation(
    '/b2b/payment-details',
    'C',
    setIsClicked
  );
  const handleContinue = () => {
    logouBMut.mutate({ accessToken, channel, page: '/b2b/payment-details' });
    setIsClicked(true);
  };

  return (
    <PaymentStatus
      cb={handleContinue}
      status="Created"
      tnxDetail={txnDetail}
      isLoading={isClicked}
    />
  );
}

/*

*/
