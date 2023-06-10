import { ResponseHeader } from './commonTypes';
import { API_URL } from '../utils/config';

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
  });
  return res.json();
}
