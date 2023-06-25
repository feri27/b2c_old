import { B2C_API_URL, COMMON_API_URL } from '@/utils/config';

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

export type TransactionDetail = GetTransactionDetail['data'];

type UpdTrxReq = {
  dbtrAgt: string;
  endToEndId: string;
  gpsCoord: string;
  merchantId: string;
  productId: string;
  page: string;
  sessionID?: string;
  reason: 'U' | 'C' | 'GL' | 'UL' | 'E' | 'M';
};

export async function getTransactionDetail({
  endToEndId,
  dbtrAgt,
  page,
}: {
  endToEndId: string;
  dbtrAgt: string;
  page: string;
}): Promise<GetTransactionDetail> {
  const res = await fetch(
    `${B2C_API_URL}/gettransactiondetail?endToEndId=${endToEndId}&dbtrAgt=${dbtrAgt}&page=${page}`
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
  console.log({ txnID });

  const res = await fetch(`${COMMON_API_URL}/transaction-number`, {
    method: 'POST',
    body: JSON.stringify({ txnID }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.json();
}
