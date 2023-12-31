import { B2C_API_URL, PORTAL_API_URL } from '@/utils/config';
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
  method: string;
  dbtrAgt: string;
};

export type NotifyTransactionReq = Transaction & {
  accessToken: string;
  sellerName: string;
  trxAmount: number;
  totalAmount: number;
  trxStatus: 'S' | 'F';
  channel: string;
  dbtrAgt: string;
};

export type TxnStatus = {
  data: {
    header: {
      status: number;
      timestamp: string;
      tracingNo: string;
      channel: string;
      accessToken: string;
    };
    body: {
      approvalStatus: 'A' | 'R' | 'C' | 'F' | 'P' | 'O';
      errorId: string;
      errorDesc: string;
    };
  };
};

export type TxnLog = {
  id: string;
  createdAt: Date;
  cRIB: number;
  cRMB: number;
  cCIB: number;
  cCMB: number;
  nRIB: number;
  nRMB: number;
  nCIB: number;
  nCMB: number;
  status: number;
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

export async function checkTxnStatus(body: {
  accessToken: string;
  channel: string;
  page: string;
  txnID: string;
  refNo: string;
  dbtrAgt: string;
}): Promise<TxnStatus> {
  const sessionID = getSessionID();
  const res = await fetch(`${B2C_API_URL}/checktxnstatus`, {
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

export async function getApprovedTransactioLog() {
  const res = await fetch(`${PORTAL_API_URL}/transactions/approved`);
  const data: { txnLog: TxnLog } | { error: string } = await res.json();
  return data;
}
