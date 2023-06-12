import { API_URL } from '@/utils/config';
import { ResponseHeader } from './commonTypes';

export type CheckUsernameRes = {
  data: {
    header: ResponseHeader;
    body: {
      securePhrase: string;
    };
  };
};

export async function checkUsername(
  username: string
): Promise<CheckUsernameRes> {
  const res = await fetch(`${API_URL}/checkusername`, {
    method: 'POST',
    body: JSON.stringify({ username }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.json();
}
