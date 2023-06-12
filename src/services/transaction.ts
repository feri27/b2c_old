import { API_URL } from '@/utils/config';
import { ResponseHeader } from './commonTypes';

export type GetTransactionDetail = {
  data: {
    msgId: string;
    currentDT: string;
    tnxId: string;
    amount: number;
    merchantName: string;
    currency: string;
    recipientReference: string;
    paymentDescription: string;
    productId: string;
    merchantID: string;
    messageId: string;
    dbtrAgt: string;
    merchantAccountType: Array<string>;
    endToEndId: string;
  };
};

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
};

export type NotifyTransactionReq = Transaction & {
  accessToken: string;
  sellerName: string;
  trxAmount: number;
  totalAmount: number;
  trxStatus: 'S' | 'F';
};

export type TransactionDetail = GetTransactionDetail['data'];

type UpdTrxReq = {
  dbtrAgt: string;
  endToEndId: string;
  gpsCoord: string;
  merchantId: string;
  productId: string;
};

export async function authorizeTransaction(
  body: AuthorizeTransactionReq
): Promise<ResponseHeader> {
  const res = await fetch(`${API_URL}/authorizetransaction`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.json();
}

export async function getTransactionDetail({
  endToEndId,
  dbtrAgt,
}: {
  endToEndId: string;
  dbtrAgt: string;
}): Promise<GetTransactionDetail> {
  const res = await fetch(
    `${API_URL}/gettransactiondetail?endToEndId=${endToEndId}&dbtrAgt=${dbtrAgt}`
  );
  return res.json();
}

export async function updateTransaction(body: UpdTrxReq) {
  const res = await fetch(`${API_URL}/updatetransaction`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.json();
}

export async function notifyTransaction(body: NotifyTransactionReq) {
  const res = await fetch(`${API_URL}/notifytransaction`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.json();
}

export async function getTransactionNumber(): Promise<{ txn_num: string }> {
  const res = await fetch(`${API_URL}/transaction-number`);
  return res.json();
}

export async function postTransactionNumber(
  txnID: string
): Promise<{ message: string }> {
  console.log({ txnID });

  const res = await fetch(`${API_URL}/transaction-number`, {
    method: 'POST',
    body: JSON.stringify({ txnID }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.json();
}
