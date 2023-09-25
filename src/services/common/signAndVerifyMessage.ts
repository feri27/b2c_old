import { COMMON_API_URL } from '@/utils/config';

export async function signMessage(
  message: string
): Promise<{ signedMessage: string }> {
  const res = await fetch(`${COMMON_API_URL}/sign-message`, {
    method: 'POST',
    body: JSON.stringify({ message }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.json();
}

export async function verifySignature({
  message,
  signature,
}: {
  message: string;
  signature: string;
}): Promise<{ message: 'success' | 'failed' }> {
  console.log({ signature });

  const res = await fetch(`${COMMON_API_URL}/verify-signature`, {
    method: 'POST',
    body: JSON.stringify({ message, signature }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.json();
}
