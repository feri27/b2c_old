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

  const cancel = (
    reason: 'U' | 'GL' | 'UL' | 'C' | 'E' | 'M',
    txnDetail: TransactionDetail | null | undefined
  ) => {
    let lat: number | undefined;
    let long: number | undefined;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        lat = pos.coords.latitude;
        long = pos.coords.longitude;
      });
    }
    const latLng = `${lat} ${long}`;

    const sessionID = getSessionID() ?? undefined;
    if (txnDetail) {
      updTrxMutation.mutate({
        endToEndId: txnDetail.endToEndId,
        dbtrAgt: txnDetail.dbtrAgt,
        gpsCoord: latLng,
        merchantId: txnDetail.merchantID,
        productId: txnDetail.productId,
        page,
        reason,
        sessionID,
      });
    }
  };
  return { cancel, updTrxMut: { isLoading: updTrxMutation.isLoading } };
}
