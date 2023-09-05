import { PORTAL_API_URL } from '@/utils/config';

export type MntLog = {
  id: string;
  submittedAt: Date;
  submittedBy: string;
  startDate: Date;
  endDate: Date;
  iRakyatYN: boolean;
  iBizRakyatYN: boolean;
  iRakyatStatus: string;
  iBizRakyatStatus: string;
  submissionStatus: string;
  approvalStatus: string;
  mid: number;
};

export async function getMntLogs() {
  const res = await fetch(`${PORTAL_API_URL}/maintenance`);
  const data: { mntLogs: MntLog[] } | { error: string } = await res.json();
  return data;
}
