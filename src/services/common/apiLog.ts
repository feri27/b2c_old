import { COMMON_API_URL } from '@/utils/config';

type ApiLog = {
  metadata: {
    currentPage: number;
    pageSize: number;
    firstPage: number;
    lastPage: number;
    totalRecords: number;
  };
  data: Array<{
    log_dt: Date;
    page: string;
    api_name: string;
    api_id: string;
    request: string;
    response: string;
  }>;
};

export async function retrieveApiLogs(pageNum: number): Promise<ApiLog> {
  const res = await fetch(`${COMMON_API_URL}/api-log?page=${pageNum}`);
  return res.json();
}
