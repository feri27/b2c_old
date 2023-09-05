import { Reason, TransactionDetail } from '@/services/common/transaction';
import { useUpdateTxnMutation } from './useUpdateTxnMutation';
import { useCallback, useMemo } from 'react';
import { getSessionID } from '@/utils/helpers';
import { useTransactionDetail } from './useTransactionDetail';
import { MerchantData } from './useMerchantData';

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
    reason: Reason,
    txnDetail: TransactionDetail | MerchantData | null | undefined
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

    const sessionID = getSessionID();
    const channel = sessionStorage.getItem('channel');
    if (txnDetail) {
      updTrxMutation.mutate({
        endToEndId: txnDetail.endToEndId,
        dbtrAgt: txnDetail.dbtrAgt,
        gpsCoord: latLng,
        merchantId: 'merchantID' in txnDetail ? txnDetail.merchantID : '',
        // productId: txnDetail.productId,
        page,
        reason,
        sessionID,
        channel: channel!,
        amount: txnDetail.amount.toString(),
        payerName: 'payerName' in txnDetail ? txnDetail.payerName : '',
        cdtrAgtBIC: 'cdtrAgtBIC' in txnDetail ? txnDetail.cdtrAgtBIC : '',
        dbtrAcctId: 'dbtrAcctId' in txnDetail ? txnDetail.dbtrAcctId : '',
        dbtrAgtBIC: 'dbtrAgtBIC' in txnDetail ? txnDetail.dbtrAgtBIC : '',
      });
    }
  };
  return { cancel, updTrxMut: { isLoading: updTrxMutation.isLoading } };
}
