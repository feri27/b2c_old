import { FromAccount } from '@/services/b2b/auth';
import { atom } from 'jotai';

type LoginBData = {
  fromAccountList: Array<FromAccount>;
  trxLimit: number;
  usedLimit: number;
};

export type CancelType =
  | 'TO'
  | 'EXP'
  | 'U'
  | 'GL'
  | 'UL'
  | 'FLD'
  | 'LgnErr'
  | 'SOF'
  | 'MFA_NR'
  | 'MFA_NIL'
  | 'VF'
  | '';

export const usernameAtom = atom<string>('');
export const securePhraseAtom = atom<string>('');
export const cancelTypeAtom = atom<CancelType>('');
export const corporateLogonIDAtom = atom('');
export const userIDAtom = atom('');
export const loginBDataAtom = atom<LoginBData | null>(null);
