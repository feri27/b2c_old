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
  };
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
