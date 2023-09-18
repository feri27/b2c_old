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

export function checkSystemLogout(message: string, router: AppRouterInstance) {
  if (message.includes('force logout')) {
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
  sessionStorage.removeItem('selectedAccount');
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

export function mapDbtrAcctTp(type: string) {
  switch (type) {
    case 'SA':
      return 'SVGS';
    case 'CA':
      return 'CACC';
    default:
      return 'CCRD';
  }
}

export function mapSrcOfFund(src: string, accNum: string) {
  const firstTwoDigits = accNum.slice(0, 2);
  if (src === '01' && firstTwoDigits === '11') {
    return 'CACC';
  } else if (src === '01' && firstTwoDigits === '22') {
    return 'SVGS';
  } else {
    return 'CCRD';
  }
}
