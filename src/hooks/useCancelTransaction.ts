import { TransactionDetail } from '@/services/common/transaction';
import { useUpdateTxnMutation } from './useUpdateTxnMutation';
import { useCallback, useMemo } from 'react';
import { getSessionID } from '@/utils/helpers';
import { useTransactionDetail } from './useTransactionDetail';

export function useCancelTransaction({
  page,
  navigate = true,
  navigateTo = '/payment-fail',
}: {
  page: string;
  navigate?: boolean;
  navigateTo?: string;
}) {
  const updTrxMutation = useUpdateTxnMutation(navigate, navigateTo);
  const txnDet = useTransactionDetail();
  const transactionDetail = useMemo(
    () => txnDet,
    [txnDet?.amount, txnDet?.currency]
  );

  const cancel = useCallback(
    (reason: 'U' | 'GL' | 'UL' | 'C' | 'E' | 'M') => {
      let lat: number | undefined;
      let long: number | undefined;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          lat = pos.coords.latitude;
          long = pos.coords.longitude;
        });
      }
      const latLng = `${lat} ${long}`;
      const sessionID = getSessionID();
      if (transactionDetail) {
        updTrxMutation.mutate({
          endToEndId: transactionDetail.endToEndId,
          dbtrAgt: transactionDetail.dbtrAgt,
          gpsCoord: latLng,
          merchantId: transactionDetail.merchantID,
          productId: transactionDetail.productId,
          page,
          reason,
          sessionID,
        });
      }
    },
    [transactionDetail]
  );
  return { cancel, updTrxMut: { isLoading: updTrxMutation.isLoading } };
}
