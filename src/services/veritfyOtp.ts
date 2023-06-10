import { API_URL } from '@/utils/config';
import { ResponseHeader } from './commonTypes';

export async function verifyOTP(body: {
  otp: string;
  iv: string;
  accessToken: string;
}): Promise<ResponseHeader> {
  const res = await fetch(`${API_URL}/verifyotp`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.json();
}
