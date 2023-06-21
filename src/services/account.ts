import { B2C_API_URL } from '@/utils/config';
import { getSessionID } from '@/utils/helpers';

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
  const sessionID = getSessionID();
  const res = await fetch(`${B2C_API_URL}/account/${id}`, {
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

export async function accountPayment({
  body,
  saving,
}: {
  body: AccPaymentRes;
  saving: boolean;
}) {
  const sessionID = getSessionID();

  if (saving) {
    const res = await fetch(`${B2C_API_URL}/savingaccountpayment`, {
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
  } else {
    const res = await fetch(`${B2C_API_URL}/currentaccountpayment`, {
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
}
