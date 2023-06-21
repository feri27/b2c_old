import crypto from 'crypto';
import Cookies from 'js-cookie';
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
  const sessionID = Cookies.get('sessionID');
  return sessionID;
}
