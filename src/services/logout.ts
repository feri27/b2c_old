import { API_URL } from '@/utils/config';
import { ResponseHeader } from './commonTypes';

export async function logout(accessToken: string): Promise<ResponseHeader> {
  const res = await fetch(`${API_URL}/logout`, {
    method: 'POST',
    body: JSON.stringify({ accessToken }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.json();
}
