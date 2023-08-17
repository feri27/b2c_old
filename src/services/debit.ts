import { B2C_API_URL } from '@/utils/config';
import { getSessionID } from '@/utils/helpers';

export type DebitReq = {
  frBIC: string;
  toBIC: string;
  bizSvc: string;
  txId: string;
  interBkSttlmAmt: string;
  instgAgtBIC: string;
  dbtrNm: string;
  dbtrAcctId: string;
  dbtrAcctTp: string;
  dbtrAgtBIC: string;
  cdtrAgtBIC: string;
  cdtrNm: string;
  cdtrAcctTp: string;
  cdtrAcctId: string;
  recptRef: string;
  channel: string;
};

export type DebitRes = {
  PymtConfirmRs: {
    resHeader: {
      FrBIC: string;
      TOBIC: string;
      BMI: string;
      MsgDef: string;
      BizSvc: string;
      CreDt: string;
      CpyDup: string;
      PssblDplct: string;
      Rtld: string;
    };
    resBody: {
      MID: string;
      CreDtTm: string;
      OrgnlMsgId: string;
      OrgnlMsgNmId: string;
      OrgnlEndToEndId: string;
      Orgn1TxId: string;
      TxSts: string;
      StsRsnInf: string;
      CdtrNm: string;
      CdtrAcctId: string;
      CdtrAcctCstmrCtg: string;
    };
  };
};

export async function debit(body: DebitReq): Promise<DebitRes> {
  const sessionID = getSessionID();
  const res = await fetch(`${B2C_API_URL}/debit`, {
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
