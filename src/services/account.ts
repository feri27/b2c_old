import { API_URL } from './config';

type Account = {
  data: {
    accNo: string;
    accName: string;
    availableBalance: string;
    creditCardNo: number;
    accHolderName: string;
  };
};

export async function account(id: string): Promise<Account> {
  const res = await fetch(`${API_URL}/account/${id}`);
  return res.json();
}
