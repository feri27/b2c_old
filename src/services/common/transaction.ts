import { B2C_API_URL, COMMON_API_URL } from '@/utils/config';
import { channel } from 'diagnostics_channel';

export type Reason =
  | 'U'
  | 'C'
  | 'GL'
  | 'UL'
  | 'E'
  | 'M'
  | 'VF'
  | 'VP'
  | 'TO'
  | 'FR'
  | 'ALF'
  | 'MFA'
  | 'FLD';

export type GetTransactionDetail = {
  data: {
    msgId: string;
    currentDT: string;
    tnxId: string;
    amount: number;
    payerName: string;
    creditorName: string;
    currency: string;
    redirectURL: string;
    recipientReference: string;
    productId: string;
    merchantID: string;
    dbtrAgt: string;
    endToEndId: string;
    sourceOfFunds: string;
    xpryDt: string;
    frBIC: string;
    toBIC: string;
    dbtrAcctId: string;
    dbtrAcctTp: string;
    dbtrAgtBIC: string;
    cdtrAcctId: string;
    cdtrAcctTp: string;
    cdtrAgtBIC: string;
    bizSvc: string;
    status: string;
  };
};

export type TransactionDetail = GetTransactionDetail['data'];

export type UpdTrxReq = {
  dbtrAgt: string;
  endToEndId: string;
  gpsCoord: string;
  merchantId: string;
  // productId: string;
  page: string;
  sessionID?: string;
  channel: string;
  reason: Reason;
  amount: string;
  cdtrAgtBIC: string;
  dbtrAcctId: string;
  payerName: string;
  dbtrAgtBIC: string;
};

export async function getTransactionDetail({
  endToEndId,
  dbtrAgt,
  page,
  channel,
}: {
  endToEndId: string;
  dbtrAgt: string;
  page: string;
  channel: string;
}): Promise<GetTransactionDetail> {
  const res = await fetch(
    `${B2C_API_URL}/gettransactiondetail?endToEndId=${endToEndId}&dbtrAgt=${dbtrAgt}&page=${page}&channel=${channel}`
  );
  return res.json();
}

export async function updateTransaction(body: UpdTrxReq) {
  const res = await fetch(`${B2C_API_URL}/updatetransaction`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.json();
}

export async function getTransactionNumber(): Promise<{ txn_num: string }> {
  const res = await fetch(`${COMMON_API_URL}/transaction-number`);
  return res.json();
}

export async function postTransactionNumber(
  txnID: string
): Promise<{ message: string }> {
  const res = await fetch(`${COMMON_API_URL}/transaction-number`, {
    method: 'POST',
    body: JSON.stringify({ txnID }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.json();
}
