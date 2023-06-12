import { atom } from 'jotai';

type SellerData = {
  dbtrAgt: string;
  endToEndId: string;
};

const initialSellerData = {
  dbtrAgt: '',
  endToEndId: '',
};

export const usernameAtom = atom<string>('');
export const securePhraseAtom = atom<string>('');
export const sellerDataAtom = atom<SellerData>(initialSellerData);
