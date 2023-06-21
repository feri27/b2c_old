import { B2B_API_URL } from '@/utils/config';
import { ResponseHeader } from '../commonTypes';
import { getSessionID } from '@/utils/helpers';

export type FromAccount = {
  fromAccNo: string;
  fromAccName: string;
  fromAccHolder: string;
  fromAccType: string;
  fromAccAmount: number;
};

type LoginBRes = {
  data: {
    header: ResponseHeader;
    body: {
      cif: string;
      trxLimit: number;
      usedLimit: number;
      fromAccountList: Array<FromAccount>;
    };
  };
};

export type LoginBResBody = LoginBRes['data']['body'];

export type LoginAndNotifyLoginCombined = {
  loginRes: LoginBRes;
  notifyRes?: { data: { header: ResponseHeader } };
};

export async function loginB({
  corporateLogonID,
  userID,
  accessToken,
  credentialIv,
  credential,
}: {
  corporateLogonID: string;
  userID: string;
  accessToken: string;
  credentialIv: string;
  credential: string;
}): Promise<LoginAndNotifyLoginCombined> {
  const body = {
    corporateLogonID,
    userID,
    accessToken,
    credentialIv,
    credential,
  };

  const res = await fetch(`${B2B_API_URL}/loginb`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const loginRes = (await res.json()) as LoginBRes;
  if (!(loginRes.data.header.status === 1)) {
    return { loginRes };
  } else {
    const notifyRes = await fetch(`${B2B_API_URL}/notify-loginb`, {
      method: 'POST',
      body: JSON.stringify({ accessToken }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await notifyRes.json();
    return {
      loginRes,
      notifyRes: result,
    };
  }
}

export async function logoutB(body: {
  accessToken: string;
  channel: string;
  page: string;
}) {
  const sessionID = getSessionID();
  const res = await fetch(`${B2B_API_URL}/logoutb`, {
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
