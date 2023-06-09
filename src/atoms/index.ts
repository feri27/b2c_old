import { TransactionDetail } from '@/services/getTransactionDetail';
import { LoginResBody } from '@/services/login';
import { atom } from 'jotai';

export const usernameAtom = atom<string>('');
export const securePhraseAtom = atom<string>('');
export const accessTokenAtom = atom<string>('');

const loginData = localStorage.getItem('loginData');
const transactionDetail = localStorage.getItem('transactionDetail');

function parseJSON<T>(json: string | null) {
  if (json === null) {
    return null;
  }
  return JSON.parse(json) as T;
}

export const loginDataAtom = atom(parseJSON<LoginResBody>(loginData));
export const transactionDetailAtom = atom(
  parseJSON<TransactionDetail>(transactionDetail)
);
