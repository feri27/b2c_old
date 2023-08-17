import { B2C_API_URL } from '@/utils/config';
import { ResponseHeader } from './commonTypes';
import { getSessionID } from '@/utils/helpers';

export async function verifyOTP(body: {
  otp: string;
  iv: string;
  accessToken: string;
  channel: string;
  deliveryChannel: string;
}): Promise<ResponseHeader> {
  const sessionID = getSessionID();
  const res = await fetch(`${B2C_API_URL}/verifyotp`, {
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
