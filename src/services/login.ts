import { B2C_API_URL } from '@/utils/config';
import { ResponseHeader } from './commonTypes';

type LoginRes = {
  data: {
    header: ResponseHeader;
    body: {
      cif: string;
      mbl: {
        trxLimit: number;
        usedLimit: number;
      };
      msl: {
        trxLimit: number;
        usedLimit: number;
      };
    };
  };
};

export type LoginResBody = LoginRes['data']['body'];

export type LoginAndNotifyLoginCombined = {
  loginRes: LoginRes;
  notifyRes?: { data: { header: ResponseHeader } };
};

export async function login({
  username,
  password,
  accessToken,
  iv,
  channel,
}: {
  username: string;
  password: string;
  accessToken: string;
  iv: string;
  channel: string;
}): Promise<LoginAndNotifyLoginCombined> {
  const body = { username, password, accessToken, channel, iv };

  const res = await fetch(`${B2C_API_URL}/login`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const loginRes = (await res.json()) as LoginRes;
  if (!(loginRes.data.header.status === 1)) {
    return { loginRes };
  } else {
    const notifyRes = await fetch(`${B2C_API_URL}/notifylogin`, {
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
