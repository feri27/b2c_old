import { COMMON_API_URL } from '@/utils/config';

export async function privateKey(): Promise<{ private_key: string }> {
  const res = await fetch(`${COMMON_API_URL}/getprivatekey`);
  return res.json();
}
