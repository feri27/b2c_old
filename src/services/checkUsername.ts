import { B2C_API_URL } from '@/utils/config';
import { ResponseHeader } from './commonTypes';

export type CheckUsernameRes = {
  data: {
    header: ResponseHeader;
    body: {
      securePhrase: string;
    };
  };
};

export async function checkUsername({
  username,
  channel,
  dbtrAgt,
}: {
  username: string;
  channel: string;
  dbtrAgt: string;
}): Promise<CheckUsernameRes> {
  const res = await fetch(`${B2C_API_URL}/checkusername`, {
    method: 'POST',
    body: JSON.stringify({ username, channel, dbtrAgt }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.json();
}
