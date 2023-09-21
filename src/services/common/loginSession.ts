import { COMMON_API_URL, B2B_API_URL } from '@/utils/config';

type LoginSessionReq = {
  userID: string;
  page: string;
};

export type LoginSessionRes = {
  data: { userID: string; sessionID: string; loginDt: string; status: string };
};

export async function createLoginSession(
  body: LoginSessionReq
): Promise<LoginSessionRes> {
  const res = await fetch(`${COMMON_API_URL}/login-session`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.json();
}

export async function updateLoginSession({
  status,
  page,
  sessionID,
  reason,
}: {
  status: 'active' | 'expired';
  page: string;
  sessionID: string;
  reason: 'C' | 'S';
}): Promise<{ message: string }> {
  const res = await fetch(`${COMMON_API_URL}/login-session/${sessionID}`, {
    method: 'PATCH',
    body: JSON.stringify({ status, page, reason }),
    headers: {
      'Content-Type': 'application/json',
      'X-Session-ID': sessionID,
    },
  });
  return res.json();
}
