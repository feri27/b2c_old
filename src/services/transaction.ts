import { B2C_API_URL } from '@/utils/config';
import { ResponseHeader } from './commonTypes';
import { getSessionID } from '@/utils/helpers';

type Transaction = {
  transactionNo: string;
  referenceNo: string;
  trxTimestamp: string;
  fromAccountNo: string;
  fromAccountHolder: string;
  errorId?: string;
  errorDesc?: string;
};

export type AuthorizeTransactionReq = Transaction & {
  creditorName: string;
  accessToken: string;
  trxAmount: number;
  totalAmount: number;
  channel: string;
};

export type NotifyTransactionReq = Transaction & {
  accessToken: string;
  sellerName: string;
  trxAmount: number;
  totalAmount: number;
  trxStatus: 'S' | 'F';
  channel: string;
};

export async function authorizeTransaction(
  body: AuthorizeTransactionReq
): Promise<ResponseHeader> {
  const sessionID = getSessionID();
  const res = await fetch(`${B2C_API_URL}/authorizetransaction`, {
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

export async function notifyTransaction(body: NotifyTransactionReq) {
  const sessionID = getSessionID();
  const res = await fetch(`${B2C_API_URL}/notifytransaction`, {
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
