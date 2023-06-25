'use client';

import {
  corporateLogonIDAtom,
  loginBDataAtom,
  sellerDataAtom,
  userIDAtom,
} from '@/atoms';
import { loginB } from '@/services/b2b/auth';
import { encrypt } from '@/utils/helpers';
import { useMutation } from '@tanstack/react-query';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { useSettingQuery } from '@/hooks/useSettingQuery';
import { useTransactionDetailQuery } from '@/hooks/useTransactionDetailQuery';
import { usePrivateKey } from '@/hooks/usePrivateKey';
import { useLoginSessionMutation } from '@/hooks/useLoginSessionMutation';
import Cookies from 'js-cookie';
import { useAccessTokenAndChannel } from '@/hooks/useAccessTokenAndChannel';
import { useCancelTransaction } from '@/hooks/useCancelTransaction';
import { useIsSessionActive } from '@/hooks/useIsSessionActive';
import Header from '@/components/b2b/Header';
import Footer from '@/components/b2b/Footer';
import Modal from '@/components/common/Modal';

export default function Login() {
  const router = useRouter();
  const sellerData = useAtomValue(sellerDataAtom);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [userID, setUserID] = useAtom(userIDAtom);
  const [corporateLogonID, setCorporateLogonID] = useAtom(corporateLogonIDAtom);
  const [password, setPassword] = useState('');
  const [_, channel] = useAccessTokenAndChannel();

  const settingQry = useSettingQuery(channel as 'B2C' | 'B2B', '/b2b/loginb');

  const getTxnQry = useTransactionDetailQuery(sellerData, '/b2b/loginb');
  const privateKeyQry = usePrivateKey();

  const { cancel, updTrxMut } = useCancelTransaction({
    page: '/b2b/loginb',
    navigateTo: '/b2b/payment-fail',
  });
  const glCancel = useCancelTransaction({
    page: '/b2b/loginb',
    navigateTo: '/b2b/maintenance',
  });

  useIsSessionActive(setIsActive);

  const loginSessionMut = useLoginSessionMutation({
    onSuccess: (data) => {
      Cookies.set('sessionID', data.data.sessionID);
      Cookies.set('loginSessionStatus', 'active');
      router.push('/b2b/payment-initiate');
    },
  });
  const loginAndNotifyMut = useMutation({
    mutationFn: loginB,
    onSuccess: (data) => {
      if (data.notifyRes?.data.header.status === 1) {
        const loginRes = data.loginRes.data.body;
        localStorage.setItem(
          'loginBData',
          JSON.stringify({
            fromAccountList: loginRes.fromAccountList,
            trxLimit: loginRes.trxLimit,
            usedLimit: loginRes.usedLimit,
          })
        );
        loginSessionMut.mutate({ page: '/b2b/loginb', userID: userID });
      }
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (privateKeyQry.data) {
      const privateKey = privateKeyQry.data.private_key;
      const { encryptedTxt, iv } = encrypt(password, privateKey);
      loginAndNotifyMut.mutate({
        accessToken: 'dsdsdsd',
        corporateLogonID,
        userID,
        credential: encryptedTxt.toString('base64'),
        credentialIv: iv.toString('base64'),
      });
    }
  };

  const validateInput = () => {
    return (
      corporateLogonID.trim().length === 0 ||
      password.trim().length === 0 ||
      userID.trim().length === 0
    );
  };

  useEffect(() => {
    if (
      settingQry.data &&
      'data' in settingQry?.data &&
      Number(settingQry.data.data.maintain_b2b) === 1
    ) {
      glCancel.cancel('M');
    }
  }, [, settingQry?.data]);

  if (!isActive) {
    return (
      <>
        <Header />
        <div className="h-between-b2b"></div>
        <Modal
          text="Your session has expired"
          isLoading={updTrxMut.isLoading}
          cb={() => {
            if (getTxnQry.data?.data) {
              cancel('E');
            }
          }}
        />
        <Footer />
      </>
    );
  }

  if (
    getTxnQry.data?.data &&
    settingQry.data &&
    'data' in settingQry.data &&
    ((/Mobi/i.test(navigator.userAgent) &&
      getTxnQry.data.data.amount < +settingQry.data.data.cmb_limit) ||
      (!/Mobi/i.test(navigator.userAgent) &&
        getTxnQry.data.data.amount < +settingQry.data.data.cib_limit))
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
                              onClick={() => cancel('U')}
                              className="cursor-pointer  disabled:opacity-50 disabled:cursor-not-allowed text-base  rounded-2xl border border-solid border-[#ec6f10] bg-white text-center w-[44%] mr-[5%] text-[#333] inline-block align-middle py-1.5 px-3"
                              disabled={
                                loginAndNotifyMut.isLoading ||
                                loginSessionMut.isLoading ||
                                updTrxMut.isLoading ||
                                settingQry.isLoading ||
                                getTxnQry.isLoading
                              }
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
                                loginAndNotifyMut.isLoading ||
                                loginSessionMut.isLoading ||
                                updTrxMut.isLoading ||
                                settingQry.isLoading ||
                                getTxnQry.isLoading
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
                        <td>{getTxnQry.data.data.merchantName}</td>
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
  } else if (
    getTxnQry.data?.data &&
    settingQry.data &&
    'data' in settingQry?.data &&
    ((/Mobi/i.test(navigator.userAgent) &&
      getTxnQry.data.data.amount > +settingQry?.data.data.cmb_limit) ||
      (!/Mobi/i.test(navigator.userAgent) &&
        getTxnQry.data.data.amount > +settingQry?.data.data.cib_limit))
  ) {
    return (
      <>
        <Header />
        <div className="h-between-b2b"></div>
        <Modal
          text="You are unable to proceed with the transaction as the amount is more than the allowed limit"
          isLoading={updTrxMut.isLoading}
          cb={() => cancel('GL')}
        />
        {/* <div className="z-100 fixed inset-0 bg-black opacity-70">
          <div className="z-100 fixed top-[50%] left-[50%] w-[80%] -translate-x-[50%] -translate-y-[50%] transform  rounded bg-gray-200 md:w-[30%] h-[40%] flex flex-col items-center justify-evenly">
            <p className="text-xl text-red-500">
              
            </p>
            <button
              disabled={}
              className="disabled:cursor-not-allowed disabled:opacity-50 rounded bg-red-500 px-4 py-1 text-white"
              onClick={() => glCancel.cancel('GL')}
            >
              OK
            </button>
          </div>
        </div> */}
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
