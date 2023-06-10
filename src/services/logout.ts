import { API_URL } from '@/utils/config';

export async function logout(accessToken: string) {
  const res = await fetch(`${API_URL}/logout`, {
    method: 'POST',
    body: JSON.stringify({ accessToken }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.json();
}
