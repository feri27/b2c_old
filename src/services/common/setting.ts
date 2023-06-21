import { COMMON_API_URL, B2B_API_URL } from '@/utils/config';

type Setting =
  | {
      data: {
        cib_limit: string;
        cmb_limit: string;
        maintain_b2b: number;
        maintain_b2c: number;
        rib_limit: string;
        rmb_limit: string;
        session_expiry: number;
      };
    }
  | { message: string };

export async function retrieveSetting(page: string): Promise<Setting> {
  const res = await fetch(`${COMMON_API_URL}/setting?page=${page}`);
  return res.json();
}
