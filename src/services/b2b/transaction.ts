import { B2B_API_URL } from '@/utils/config';
import { ResponseHeader } from '../commonTypes';
import { getSessionID } from '@/utils/helpers';

type TransactionB = {
  corporateLogonID: string;
  userID: string;
  fpxTrxID: string;
  fpxTrxType: string;
  referenceNo: string;
  exchangeID: string;
  trxTimestamp: string;
  fromAccNo: string;
  fromAccType: string;
  fromAccHolder: string;
  sellerOrdNo: string;
  sellerName: string;
  otherPmtDetails: string;
  trxAmount: number;
  trxCharge: number;
  totalAmount: number;
  trxStatus: string;
  channel: string;
  accessToken: string;
  dbtrAgt: string;
  endToEndId: string;
  productId: string;
  latlong: string;
  xpryDt: string;
};

export async function createTxn(body: TransactionB): Promise<ResponseHeader> {
  const sessionID = getSessionID();
  const res = await fetch(`${B2B_API_URL}/transaction`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: sessionID
      ? {
          'Content-Type': 'application/json',
          'X-Session-ID': sessionID,
        }
      : {
          'Content-Type': 'application/json',
        },
  });
  return res.json();
}
