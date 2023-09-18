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
  //for debit
  bizSvc: string;
  cdtrAcctId: string;
  cdtrAcctTp: string;
  cdtrAgtBIC: string;
  dbtrAcctId: string;
  dbtrAcctTp: string;
  dbtrAgtBIC: string;
  dbtrNm: string;
  frBIC: string;
  toBIC: string;
};

export async function createTxn(
  body: TransactionB
): Promise<{ data: { header: ResponseHeader } }> {
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
