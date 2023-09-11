'use client';

import {
  cancelTypeAtom,
  corporateLogonIDAtom,
  loginBDataAtom,
  userIDAtom,
} from '@/atoms';
import { loginB } from '@/services/b2b/auth';
import { checkSystemLogout, encrypt } from '@/utils/helpers';
import { useMutation } from '@tanstack/react-query';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { useSettingQuery } from '@/hooks/useSettingQuery';
import { useTransactionDetailQuery } from '@/hooks/useTransactionDetailQuery';
import { usePrivateKey } from '@/hooks/usePrivateKey';
import { useLoginSessionMutation } from '@/hooks/useLoginSessionMutation';
import { useAccessTokenAndChannel } from '@/hooks/useAccessTokenAndChannel';
import { useCancelTransaction } from '@/hooks/useCancelTransaction';
import { useIsSessionActive } from '@/hooks/useIsSessionActive';
import Header from '@/components/b2b/Header';
import Footer from '@/components/b2b/Footer';
import { useMerchantData } from '@/hooks/useMerchantData';
import { useCheckMaintenaceTime } from '@/hooks/useCheckMaintenaceTime';
import { useCheckSignature } from '@/hooks/useCheckSignature';
import { useUpdateTxnMutation } from '@/hooks/useUpdateTxnMutation';
import { useCheckGlobalLimit } from '@/hooks/useCheckGlobalLimit';
import { useGetApprovedTransactionLog } from '@/hooks/useGetApprovedTransactionLog';

export default function Login() {
  const router = useRouter();
  const [userID, setUserID] = useAtom(userIDAtom);
  const setCancelType = useSetAtom(cancelTypeAtom);
  const [corporateLogonID, setCorporateLogonID] = useAtom(corporateLogonIDAtom);
  const [password, setPassword] = useState('');
  const [_, channel] = useAccessTokenAndChannel();
  const [isClicked, setIsClicked] = useState(false);
  const merchantData = useMerchantData();
  const privateKeyQry = usePrivateKey();
  const [fetchTxnDetail, setFetchTxnDetail] = useState(false);
  const [fetchSettings, setFetchSettings] = useState(false);

  useCheckMaintenaceTime('B2B');

  const getTxnQry = useTransactionDetailQuery(
    merchantData,
    '/login',
    fetchTxnDetail
  );
  const approvedTxnLogQry = useGetApprovedTransactionLog();
  const { cancel, updTrxMut } = useCancelTransaction({
    page: '/b2b/loginb',
    navigateTo: '/b2b/payment-fail',
    channel: 'B2B',
  });
  // const glCancel = useCancelTransaction({
  //   page: '/b2b/loginb',
  //   navigateTo: '/b2b/maintenance',
  // });
  useSettingQuery('B2B', '/b2b/loginb', fetchSettings);
  const updateTxnMut = useUpdateTxnMutation(false, '', 'B2B', (data) => {
    if ('message' in data) {
      checkSystemLogout(data.message as string, router, 'B2B');
    }
    if (
      ('statusCode' in data && data['statusCode'] === 'ACTC') ||
      data['statusCode'] === 'ACSP'
    ) {
      setFetchTxnDetail(true);
    } else if ('message' in data && data['message'] === 'timeout') {
      setCancelType('TO');
      cancel('TO', merchantData);
    } else {
      setCancelType('FLD');
      cancel('FR', merchantData);
    }
  });

  useIsSessionActive(() => {
    setCancelType('EXP');
    cancel('E', merchantData);
    sessionStorage.setItem('exp', 'true');
  });

  useCheckSignature({
    cancel,
    updateTxnMut,
    channel: channel || 'B2C',
  });

  const loginSessionMut = useLoginSessionMutation({
    onSuccess: (data) => {
      sessionStorage.setItem('sessionID', data.data.sessionID);
      sessionStorage.setItem('loginSessionStatus', 'active');
      router.push('/b2b/payment-initiate');
    },
    onError: () => {
      setIsClicked(false);
    },
  });
  const loginAndNotifyMut = useMutation({
    mutationFn: loginB,
    onSuccess: (data) => {
      if (
        'message' in data.loginRes &&
        data.loginRes.message.includes('TIMEOUT')
      ) {
        setCancelType('TO');
        cancel('TO', merchantData);
      } else if (
        data.notifyRes &&
        'message' in data.notifyRes &&
        data.notifyRes.message.includes('TIMEOUT')
      ) {
        setCancelType('TO');
        cancel('TO', merchantData);
      } else if (
        data.notifyRes &&
        'data' in data.notifyRes &&
        data.notifyRes.data.header.status === 1 &&
        'data' in data.loginRes
      ) {
        const loginRes = data.loginRes.data.body;
        sessionStorage.setItem(
          'loginBData',
          JSON.stringify({
            fromAccountList: loginRes.fromAccountList,
            trxLimit: loginRes.trxLimit,
            usedLimit: loginRes.usedLimit,
          })
        );
        sessionStorage.setItem(
          'accessToken',
          data.loginRes.data.header.accessToken
        );
        loginSessionMut.mutate({ page: '/b2b/loginb', userID: userID });
      } else {
        setCancelType('U');
        cancel('C', merchantData);
      }
    },
    onError: () => {
      setIsClicked(false);
      setCancelType('U');
      cancel('C', merchantData);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const accessToken = sessionStorage.getItem('accessToken') ?? '';
    if (privateKeyQry.data) {
      const privateKey = privateKeyQry.data.private_key;
      const { encryptedTxt, iv } = encrypt(password, privateKey);
      loginAndNotifyMut.mutate({
        accessToken,
        corporateLogonID,
        userID,
        credential: encryptedTxt.toString('base64'),
        credentialIv: iv.toString('base64'),
      });
      setIsClicked(true);
    }
  };

  const validateInput = () => {
    return (
      corporateLogonID.trim().length === 0 ||
      password.trim().length === 0 ||
      userID.trim().length === 0
    );
  };
  console.log(approvedTxnLogQry.data);

  useCheckGlobalLimit(
    getTxnQry.data,
    approvedTxnLogQry.data,
    cancel,
    'B2B',
    setFetchSettings
  );

  // if (!isActive) {
  //   return (
  //     <>
  //       <Header />
  //       <div className="h-between-b2b"></div>
  //       <Modal
  //         text="Your session has expired"
  //         isLoading={updTrxMut.isLoading}
  //         cb={() => {
  //           if (getTxnQry.data?.data) {
  //             cancel('E', getTxnQry.data.data);
  //           }
  //         }}
  //       />
  //       <Footer />
  //     </>
  //   );
  // }

  if (
    getTxnQry.data?.data &&
    (getTxnQry.data.data.status === 'ACTC' ||
      getTxnQry.data?.data.status === 'ACSP') &&
    approvedTxnLogQry.data &&
    'txnLog' in approvedTxnLogQry.data &&
    ((/Mobi/i.test(navigator.userAgent) &&
      getTxnQry.data.data.amount < approvedTxnLogQry.data.txnLog.cCMB) ||
      (!/Mobi/i.test(navigator.userAgent) &&
        getTxnQry.data.data.amount < approvedTxnLogQry.data.txnLog.cCIB))
  ) {
    return (
      <>
        <Header />
        <main>
          <div className="w-full px-3 mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] md:max-w-[720px] min-[576px]:max-w-[540px] min-[1200px]:leading-[1.2]">
            <div className="flex items-stretch max-[768px]:flex-col w-full">
              <div className="mt-6 max-[768px]:min-w-[initial] p-10 w-full min-[992px]:w-[41.7%]">
                <table className="w-full caption-bottom border-collapse">
                  <tbody>
                    <tr>
                      <td>
                        <h3 className="text-[#0077cb] text-[calc(1.3rem_+_.6vw)] min-[1200px]:text-[1.5rem]">
                          Welcome, Please Login
                        </h3>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p className="mb-4">
                          Manage Your Account Online at Your Convenience
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <br />
                <table className="w-full caption-bottom border-collapse border-spacing-0.5">
                  <tbody>
                    <tr>
                      <td>
                        <form
                          id="ibiz_paymentInitiate1"
                          className="block mx-auto py-2.5 float-none"
                          autoComplete="off"
                          onSubmit={handleSubmit}
                        >
                          <div className="mb-[15px]">
                            <input
                              className="rounded-[10px] border-b-[2px] border-b-solid focus-within:outline outline-[#a7d5f0] border-b-[#ec6f10] overflow-hidden inline-block whitespace-pre-wrap text-ellipsis w-full  px-3 text-base bg-white bg-clip-padding mb-2.5"
                              type="text"
                              autoComplete="off"
                              placeholder="Enter Your ID"
                              id="j_username"
                              name="j_username"
                              value={userID}
                              onChange={(e) => setUserID(e.target.value)}
                            />
                          </div>
                          <div className="mb-[15px]">
                            <input
                              className="rounded-[10px] border-b-[2px] border-b-solid focus-within:outline outline-[#a7d5f0] border-b-[#ec6f10] overflow-hidden inline-block whitespace-pre-wrap text-ellipsis w-full  px-3 text-base bg-white bg-clip-padding mb-2.5"
                              type="password"
                              id="m_password"
                              placeholder="Enter Password"
                              name="m_password"
                              size={35}
                              maxLength={30}
                              autoComplete="off"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                            <input
                              type="hidden"
                              id="j_password"
                              name="j_password"
                            />
                            <input type="hidden" id="j_nonce" name="j_nonce" />
                          </div>
                          <div className="mb-[15px]">
                            <input
                              className="rounded-[10px] border-b-[2px] border-b-solid focus-within:outline outline-[#a7d5f0] border-b-[#ec6f10] overflow-hidden inline-block whitespace-pre-wrap text-ellipsis w-full  px-3 text-base bg-white bg-clip-padding mb-2.5"
                              type="text"
                              id="j_companyId"
                              placeholder="Enter Corporate ID"
                              name="j_companyId"
                              size={14}
                              maxLength={20}
                              autoComplete="off"
                              value={corporateLogonID}
                              onChange={(e) =>
                                setCorporateLogonID(e.target.value)
                              }
                            />
                          </div>
                          <div className="mb-[15px]">
                            <button
                              type="button"
                              value="Cancel"
                              onClick={() => {
                                setCancelType('U');
                                cancel('U', getTxnQry.data?.data);
                              }}
                              className="cursor-pointer  disabled:opacity-50 disabled:cursor-not-allowed text-base  rounded-2xl border border-solid border-[#ec6f10] bg-white text-center w-[44%] mr-[5%] text-[#333] inline-block align-middle py-1.5 px-3"
                              disabled={isClicked || updTrxMut.isLoading}
                            >
                              Cancel
                            </button>
                            <button
                              id="login"
                              type="submit"
                              name="login"
                              className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-base rounded-2xl border border-solid border-[#ec6f10] bg-white text-center w-[44%] mr-[5%] text-[#333] inline-block align-middle py-1.5 px-3"
                              disabled={
                                validateInput() ||
                                isClicked ||
                                updTrxMut.isLoading
                              }
                            >
                              Login
                            </button>
                          </div>
                        </form>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <br />
              </div>
              <div className="w-full max-[768px]:ml-0 ml-[50px] block">
                <div className="overflow-x-auto !mt-6">
                  <table className="border w-full border-solid border-[#dee2e6] max-[768px]:text-sm">
                    <thead className="bg-[#006fb3] align-bottom text-white font-bold">
                      <tr className="table-row">
                        <td scope="col" className="p-2 table-cell" colSpan={2}>
                          FPX Payment Details
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th className="p-4 text-right" scope="row"></th>
                      </tr>
                      <tr>
                        <th scope="row" className="w-[41.7%] p-4 text-right">
                          Pay To
                        </th>
                        <td>{getTxnQry.data.data.creditorName}</td>
                      </tr>
                      <tr>
                        <th className="w-[41.7%] p-4 text-right" scope="row">
                          OBW Message ID
                        </th>
                        <td>{getTxnQry.data.data.endToEndId}</td>
                      </tr>
                      <tr>
                        <th className="w-[41.7%] p-4 text-right" scope="row">
                          Invoice No
                        </th>
                        <td>{getTxnQry.data.data.recipientReference}</td>
                      </tr>
                      <tr>
                        <th className="w-[41.7%] p-4 text-right" scope="row">
                          Transaction Amount
                        </th>
                        <td>{getTxnQry.data.data.amount}</td>
                      </tr>
                      <tr>
                        <th
                          className="w-[41.7%] p-4 text-right"
                          scope="row"
                        ></th>
                      </tr>
                      <tr>
                        <th
                          className="w-[41.7%] p-4 text-right"
                          scope="row"
                        ></th>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  } else {
    return (
      <>
        <Header />
        <div className="flex flex-col flex-auto h-between-b2b w-full justify-center items-center">
          Loading...
        </div>
        <Footer />
      </>
    );
  }
}
