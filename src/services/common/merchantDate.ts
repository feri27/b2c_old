import { COMMON_API_URL } from '@/utils/config';

/**
 * {
    "msgId":"20230525DMMMYKL186290556799",
    "txId":"20230525WYTTMYKL861OBW66430434",
    "amount":100.0,
    "endToEndId":"ABC123",
    "payerName":"John Doe",
    "redirectUrl":"https://example.com",
    "xpryDt":"2023-07-28",
    "creditorName":"John Doe",
    "accptblSrcOfFunds":"01,02",
    "refs1":"Reference Data",
    "username":"jane",
    "customerMBL":"100",
    "customerUsedMBL":"10",
    "customerMSL":"200",
    "customerUsedMSL":"20",
    "mfaMethod":"MO"}
 */

export type SubmitMerchantData = {
  msgId: string;
  xpryDt: string;
  txnId: string;
  amount: number;
  creditorName: string;
  payerName: string;
  refs1: string;
  redirectUrl: string;
  username: string;
  accptblSrcOfFunds: string;
  customerMBL: string;
  customerUsedMBL: string;
  customerMSL: string;
  customerUsedMSL: string;
  mfaMethod: string;
  endToEndId: string;
};

export async function submitMerchantData(body: SubmitMerchantData) {
  const res = await fetch(`${COMMON_API_URL}/merchant-data`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.json();
}
