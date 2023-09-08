import crypto from 'crypto';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
export function generateEightDigitNum() {
  let randomNumber = Math.floor(Math.random() * 100000000);
  let paddedNumber = randomNumber.toString().padStart(8, '0');
  return paddedNumber;
}

export function getDate() {
  const date = new Date();
  return date
    .toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/.\s/g, '')
    .replace(/\./g, '');
}

export function encrypt(text: string, key: string) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-ctr', Buffer.from(key), iv);

  const encryptedTxt = Buffer.concat([cipher.update(text), cipher.final()]);

  return { encryptedTxt, iv };
}

export function sessionExpiryTime(seconds: number) {
  const currentSec = Math.floor(Date.now() / 1000);
  return currentSec + seconds;
}

export function getSessionID() {
  const sessionID = sessionStorage.getItem('sessionID');
  return sessionID ?? undefined;
}

export function checkSystemLogout(
  message: string,
  router: AppRouterInstance,
  channel: string
) {
  if (message.includes('force logout')) {
    if (channel === 'B2B') {
      removeEverySessionStorageItem(true);
      router.push('/b2b/loginb');
    }
    removeEverySessionStorageItem();
    router.push('/logout');
  }
}

export function removeEverySessionStorageItem(exception?: boolean) {
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('channel');
  sessionStorage.removeItem('transactionDetail');
  sessionStorage.removeItem('loginData');
  sessionStorage.removeItem('loginBData');
  if (!exception || exception !== true) {
    sessionStorage.removeItem('merchantData');
    sessionStorage.setItem('sessionStatus', 'expired');
  }
  sessionStorage.removeItem('exp');
  sessionStorage.removeItem('sessionExpiry');
  sessionStorage.removeItem('sessionID');
  sessionStorage.removeItem('mfa');
  sessionStorage.setItem('loginSessionStatus', 'expired');
}
