import { COMMON_API_URL } from '@/utils/config';

type ApiLog = {
  data: Array<{
    log_dt: Date;
    page: string;
    api_name: string;
    api_id: string;
    request: string;
    response: string;
  }>;
};

export async function retrieveApiLogs(): Promise<ApiLog> {
  const res = await fetch(`${COMMON_API_URL}/api-log`);
  return res.json();
}
