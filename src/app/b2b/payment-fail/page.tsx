'use client';
import PaymentStatus from '@/components/b2b/PaymentStatus';
import { useAccessTokenAndChannel } from '@/hooks/useAccessTokenAndChannel';
import { useLogoutBMutation } from '@/hooks/useLogoutBMutation';
import { useTransactionDetail } from '@/hooks/useTransactionDetail';

export default function PaymentFail() {
  const txnDetail = useTransactionDetail();
  const [accessToken, channel] = useAccessTokenAndChannel();

  const logouBMut = useLogoutBMutation('/b2b/payment-details', 'S');
  const handleContinue = () => {
    logouBMut.mutate({ accessToken, channel, page: '/b2b/payment-fail' });
  };

  return (
    <PaymentStatus cb={handleContinue} status="Cancel" tnxDetail={txnDetail} />
  );
}

/*

*/
