import { FromAccount } from '@/services/b2b/auth';
import { atom } from 'jotai';

export type SellerData = {
  dbtrAgt: string;
  endToEndId: string;
  trxId: string;
  messageId: string;
  merchantId: string;
  amount: string;
  merchantAccountType: string;
  customerName: string;
  paymentDescription: string;
  merchantName: string;
  productID: string;
  recipientReference: string;
  sourceOfFund: Set<string>;
  channel: string;
};

export const initialSellerData: SellerData = {
  dbtrAgt: '',
  endToEndId: '',
  amount: '',
  channel: '',
  customerName: '',
  merchantAccountType: '',
  merchantId: '',
  merchantName: '',
  messageId: '',
  paymentDescription: '',
  productID: '',
  recipientReference: '',
  sourceOfFund: new Set(),
  trxId: '',
};

type LoginBData = {
  fromAccountList: Array<FromAccount>;
  trxLimit: number;
  usedLimit: number;
};

export const usernameAtom = atom<string>('');
export const securePhraseAtom = atom<string>('');
export const sellerDataAtom = atom<SellerData>(initialSellerData);
export const corporateLogonIDAtom = atom('');
export const userIDAtom = atom('');
export const loginBDataAtom = atom<LoginBData | null>(null);
