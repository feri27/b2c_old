import { API_URL } from '@/utils/config';

export async function privateKey(): Promise<{ private_key: string }> {
  const res = await fetch(`${API_URL}/getprivatekey`);
  return res.json();
}
