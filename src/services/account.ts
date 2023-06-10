import { API_URL } from '../utils/config';

export type Account = {
  data: {
    accNo: string;
    accName: string;
    availableBalance: string;
    creditCardNo: number;
    accHolderName: string;
  };
};

type AccPaymentRes = {
  actNo: string;
  addenda: string;
  sellerId: string;
  sellerOdNo: string;
  senderName: string;
  trxAmt: number;
};

export async function account(id: string): Promise<Account> {
  const res = await fetch(`${API_URL}/account/${id}`);
  return res.json();
}

export async function accountPayment({
  body,
  saving,
}: {
  body: AccPaymentRes;
  saving: boolean;
}) {
  const config = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (saving) {
    const res = await fetch(`${API_URL}/savingaccountpayment`, config);
    return res.json();
  } else {
    const res = await fetch(`${API_URL}/currentaccountpayment`, config);
    return res.json();
  }
}
