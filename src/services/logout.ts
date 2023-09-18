import { B2C_API_URL } from '@/utils/config';
import { ResponseHeader } from './commonTypes';
import { getSessionID } from '@/utils/helpers';

export async function logout(body: {
  accessToken: string;
  channel: string;
  page: string;
  dbtrAgt: string;
}): Promise<ResponseHeader> {
  const sessionID = getSessionID();
  const res = await fetch(`${B2C_API_URL}/logout`, {
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
