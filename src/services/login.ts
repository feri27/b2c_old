import { ResponseHeader } from './commonTypes';
import { API_URL } from './config';

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

export async function login({
  username,
  password,
  accessToken,
}: {
  username: string;
  password: string;
  accessToken: string;
}): Promise<LoginRes> {
  const body = { username, password, accessToken };

  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.json();
}

export async function notifyLogin(
  accessToken: string
): Promise<ResponseHeader> {
  const res = await fetch(`${API_URL}/notifylogin`, {
    method: 'POST',
    body: JSON.stringify({ accessToken }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.json();
}
