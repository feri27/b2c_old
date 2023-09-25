import { useEffect, useState } from 'react';

export type MerchantData = {
  dbtrAgt: string;
  endToEndId: string;
  // txnId: string;
  // msgId: string;
  // merchantId: string;
  // amount: number;
  // mfaMethod: string;
  // creditorName: string;
  // username: string;
  // merchantName: string;
  // xpryDt: string;
  // refs1: string;
  // customerMBL: string;
  // customerUsedMBL: string;
  // customerMSL: string;
  // customerUsedMSL: string;
  // accptblSrcOfFunds: string;
  channel: string;
  endToEndIdSignature: { populated: boolean; value: string };
};

export const initialMerchantData: MerchantData = {
  dbtrAgt: '',
  endToEndId: '',
  // amount: 0,
  channel: '',
  // creditorName: '',
  // mfaMethod: '',
  // merchantId: '',
  // merchantName: '',
  // msgId: '',
  // username: '',
  // xpryDt: '',
  // refs1: '',
  // accptblSrcOfFunds: '',
  // txnId: '',
  endToEndIdSignature: { populated: false, value: '' },
  // customerMBL: '',
  // customerUsedMBL: '',
  // customerMSL: '',
  // customerUsedMSL: '',
};

export function useMerchantData() {
  const [merchantData, setMerchantData] =
    useState<MerchantData>(initialMerchantData);

  useEffect(() => {
    const mrchtData = sessionStorage.getItem('merchantData');
    if (mrchtData) {
      const parsed = JSON.parse(mrchtData);
      setMerchantData(parsed);
    }
  }, []);
  return merchantData;
}
