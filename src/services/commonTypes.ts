export type Header = {
  trxType: string;
  timestamp: string;
  tracingNo: string;
  channel: string;
  accessToken: string;
  signature: string;
};

export type ResponseHeader = Header & {
  status: number;
  errorId?: string;
  errorDesc?: string;
};
