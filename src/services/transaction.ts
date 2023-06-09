import { API_URL } from './config';

type GetTransactionDetail = {
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
  };
};

export type TransactionDetail = GetTransactionDetail['data'];

type UpdTrxReq = {
  dbtrAgt: string;
  endToEndId: string;
  gpsCoord: string;
  merchantId: string;
  productId: string;
};

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
  });
  return res.json();
}
