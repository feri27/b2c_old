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
  loginRes: LoginBRes | { message: string };
  notifyRes?: { data: { header: ResponseHeader } } | { message: string };
};

export async function loginB(body: {
  corporateLogonID: string;
  userID: string;
  accessToken: string;
  credentialIv: string;
  credential: string;
  dbtrAgt: string;
}): Promise<LoginAndNotifyLoginCombined> {
  const { accessToken, ...restBody } = body;

  const res = await fetch(`${B2B_API_URL}/loginb`, {
    method: 'POST',
    body: JSON.stringify(restBody),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const loginRes = (await res.json()) as LoginBRes | { message: string };
  if ('message' in loginRes || !(loginRes.data.header.status === 1)) {
    return { loginRes };
  } else {
    const notifyResponse = await fetch(`${B2B_API_URL}/notify-loginb`, {
      method: 'POST',
      body: JSON.stringify({
        accessToken: loginRes.data.header.accessToken,
        dbtrAgt: restBody.dbtrAgt,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await notifyResponse.json();
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
  dbtrAgt: string;
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
