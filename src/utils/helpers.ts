import { CancelType } from '@/atoms';
import { TransactionDetail } from '@/services/common/transaction';
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
  channel: 'B2C' | 'B2B',
  cb: () => void
) {
  if (message.includes('force logout')) {
    cb();
    removeEverySessionStorageItem();
    if (channel === 'B2C') {
      router.push('/logout');
    } else {
      router.push('/b2b/logout');
    }
  }
}

export function removeEverySessionStorageItem(exception?: boolean) {
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('notifyAccessToken');
  sessionStorage.removeItem('channel');
  sessionStorage.removeItem('transactionDetail');
  sessionStorage.removeItem('loginData');
  sessionStorage.removeItem('loginBData');
  sessionStorage.removeItem('selectedAccount');
  if (!exception) {
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

export function formatCurrency(num?: number) {
  if ((num && isNaN(num)) || !num) return '';
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function getStatusMessage(cancelType: CancelType) {
  let status = '';
  switch (cancelType) {
    case '':
      status = '';
    case 'TO':
      status = 'Unsuccessful - Transaction has encountered timeout error';
      break;
    case 'EXP':
      status = 'Unsuccessful - Transaction has expired';
      break;
    case 'FLD':
      status = 'Unsuccessful - Transaction has been rejected';
      break;
    case 'GL':
    case 'UL':
      status = 'Unsuccessful - Transaction exceeded limit';
      break;
    case 'LgnErr':
      status = 'Unsuccessful – Invalid User ID, Password and/or Corporate ID';
      break;
    case 'SOF':
      status =
        'Unsuccessful  - Transaction is rejected due to invalid source of fund';
      break;
    case 'MFA_NIL':
      status =
        'Unsuccessful - iSecure is not available at this moment. Please try again later';
      break;
    case 'MFA_NR':
      status =
        'Unsuccessful - Kindly activate iSecure in iRakyat Mobile Banking to authorize this transaction';
      break;
    case 'VF':
      status = 'Unsuccessful - Signature verification failed';
      break;
    default:
      status = 'Unsuccessful - Transaction has been canceled';
  }
  return status;
}

export function getCurrentDateAndExpiryDates(
  txnDetail: TransactionDetail | undefined | null
) {
  const sessExp = sessionStorage.getItem('sessionExpiry');
  const sessionExpiry = parseInt(sessExp ?? '0');
  let expiryDate =
    txnDetail !== null && txnDetail !== undefined
      ? new Date(txnDetail.xpryDt)
      : undefined;
  const xpryDTtime =
    expiryDate !== undefined
      ? Math.floor(expiryDate.getTime() / 1000)
      : undefined;
  const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000);
  return { sessionExpiry, xpryDTtime, currentTimeInSeconds };
}

export function checkSessionExpiry(
  runOnLogin: boolean,
  cb: () => void,
  txnDetail: TransactionDetail | undefined | null
) {
  const { sessionExpiry, xpryDTtime, currentTimeInSeconds } =
    getCurrentDateAndExpiryDates(txnDetail);
  if (runOnLogin) {
    if (currentTimeInSeconds > sessionExpiry) {
      // setIsActive(false);
      cb();
    }
  } else {
    if (
      currentTimeInSeconds > sessionExpiry ||
      (xpryDTtime && currentTimeInSeconds > xpryDTtime)
    ) {
      // setIsActive(false);
      cb();
    }
  }
  return runOnLogin
    ? currentTimeInSeconds > sessionExpiry
    : currentTimeInSeconds > sessionExpiry ||
        (xpryDTtime ? currentTimeInSeconds > xpryDTtime : false);
}
export function getLocalDateWithISOFormat() {
  const date = new Date();
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are 0-11 in JavaScript
  const day = ('0' + date.getDate()).slice(-2);
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const seconds = ('0' + date.getSeconds()).slice(-2);
  const milliseconds = ('00' + date.getMilliseconds()).slice(-3);
  const localDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
  return localDate;
}
