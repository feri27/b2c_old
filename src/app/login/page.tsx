'use client';
import { cancelTypeAtom, securePhraseAtom, usernameAtom } from '@/atoms';
import Steps from '@/components/Steps';
import { checkUsername } from '@/services/checkUsername';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import SeparatorLine from '@/components/SeparatorLine';
import Header from '@/components/Header';
import LoginSidebar from '@/components/LoginSidebar';
import LoginFooter from '@/components/LoginFooter';
import { useAccessTokenAndChannel } from '@/hooks/useAccessTokenAndChannel';
import { useSettingQuery } from '@/hooks/useSettingQuery';
import { useTransactionDetailQuery } from '@/hooks/useTransactionDetailQuery';
import { useIsSessionActive } from '@/hooks/useIsSessionActive';
import { useCancelTransaction } from '@/hooks/useCancelTransaction';
import { useMerchantData } from '@/hooks/useMerchantData';
import { useCheckMaintenaceTime } from '@/hooks/useCheckMaintenaceTime';
import { useGetApprovedTransactionLog } from '@/hooks/useGetApprovedTransactionLog';
import { useCheckSignature } from '@/hooks/useCheckSignature';
import { useCheckGlobalLimit } from '@/hooks/useCheckGlobalLimit';
import { useCheckTxnDetailXpry } from '@/hooks/useCheckTxnDetailXpry';
import { checkSessionExpiry } from '@/utils/helpers';

export default function Login() {
  const router = useRouter();
  const setCancelType = useSetAtom(cancelTypeAtom);
  const [username, setUsername] = useAtom(usernameAtom);
  const [_, setSecurePhrase] = useAtom(securePhraseAtom);
  const [visible, setVisible] = useState<'hidden' | 'inline'>('hidden');
  const [__, channel] = useAccessTokenAndChannel();
  const merchantData = useMerchantData();
  const [isClicked, setIsClicked] = useState(false);
  const [fetchTxnDetail, setFetchTxnDetail] = useState(false);
  const [fetchTxnDetailCheckMaintenance, setFetchTxnDetailCheckMaintenance] =
    useState(false);
  const [fetchSettings, setFetchSettings] = useState(false);
  const [loadPage, setLoadPage] = useState(false);

  useCheckMaintenaceTime('B2C', () => {
    setFetchTxnDetailCheckMaintenance(true);
  });

  const getTxnQry = useTransactionDetailQuery(
    merchantData,
    '/login',
    fetchTxnDetail && fetchTxnDetailCheckMaintenance
  );
  const { cancel: CancelFn, updTrxMut } = useCancelTransaction({
    page: '/login',
    channel: 'B2C',
  });
  const cancel = useCallback(CancelFn, []);

  useIsSessionActive(
    () => {
      setCancelType('EXP');
      cancel('E', getTxnQry.data?.data);
    },
    true,
    'B2C'
  );

  useCheckTxnDetailXpry({
    data: getTxnQry.data,
    cb1: () => {
      setCancelType('EXP');
      cancel('E', getTxnQry.data?.data);
    },
    cb2: () => {
      setLoadPage(true);
    },
  });

  useSettingQuery(channel as 'B2C' | 'B2B', '/login', fetchSettings);
  const approvedTxnLogQry = useGetApprovedTransactionLog();

  useCheckSignature({
    cancel,
    cb: () => {
      setFetchTxnDetail(true);
    },
  });

  useCheckGlobalLimit(
    getTxnQry.data,
    approvedTxnLogQry.data,
    cancel,
    'B2C',
    setFetchSettings
  );

  const checkUsernameMut = useMutation({
    mutationFn: checkUsername,
    onSuccess: (data) => {
      if (data.data.header.errorId || 'message' in data) {
        setCancelType('LgnErr');
        cancel('FR', getTxnQry.data?.data);
      } else {
        setSecurePhrase(data.data.body.securePhrase);
        sessionStorage.setItem('accessToken', data.data.header.accessToken);
        router.push('/secure-phrase');
      }
    },
    onError: (error) => {
      setCancelType('U');
      cancel('FR', getTxnQry.data?.data);
      setIsClicked(false);
    },
  });

  const handleSumbit = () => {
    const expired = checkSessionExpiry(
      false,
      () => {
        setCancelType('EXP');
        cancel('E', getTxnQry.data?.data);
      },
      getTxnQry.data?.data
    );
    if (expired) {
      return;
    }
    if (!username.trim()) {
      setVisible('inline');
      return;
    } else {
      setVisible('hidden');
      checkUsernameMut.mutate({
        username,
        channel,
        dbtrAgt: merchantData.dbtrAgt,
      });
      setIsClicked(true);
    }
  };

  useEffect(() => {
    sessionStorage.setItem('sessionStatus', 'active');
  }, []);

  if (
    getTxnQry.data?.data &&
    (getTxnQry.data.data.status === 'ACTC' ||
      getTxnQry.data?.data.status === 'ACSP') &&
    approvedTxnLogQry.data &&
    'txnLog' in approvedTxnLogQry.data &&
    ((/Mobi/i.test(navigator.userAgent) &&
      getTxnQry.data.data.amount <= approvedTxnLogQry.data.txnLog.nRMB) ||
      (!/Mobi/i.test(navigator.userAgent) &&
        getTxnQry.data.data.amount <= approvedTxnLogQry.data.txnLog.nRIB)) &&
    loadPage
  ) {
    return (
      <>
        <SeparatorLine bottom={false} />
        <Header backgroundImg={true} />
        <div className="h-between">
          <div className="min-[576]-w-[41.66667%] mb-2 min-[1200px]:w-1/3 flex justify-end ">
            <Steps title="" step={1} />
          </div>
          <div className="flex flex-col min-[1200px]:max-w-[960px] min-[992px]:max-w-[890px] md:max-w-[720px] min-[576px]:max-w-[540px]  md:flex-row  items-stretch padx  mx-auto">
            <div className="p-10 bg-white shadow-sm leading-[1.5] ">
              <h3 className="text-[#e9730d] mt-0 leading-[1.2] text-center min-[1200px]:text-[1.75rem] text-[calc(1.3rem_+_0.6vw)]  mb-2 font-medium">
                Welcome to <b className="font-extrabold">iRakyat</b> Internet
                Banking
              </h3>
              <span className="text-center font-normal text-sm block">
                Manage your account online at <br /> your convenience
              </span>
              <div className="!mb-[15px]"></div>
              <div
                id="messages"
                className="mt-1.5 pl-[22px] bg-[url('https://payment.bankrakyat.com.my/fpxonline/fpxui/css/images/ib/error.png')] bg-no-repeat text-[#a70000] text-[.67em] text-left mb-1"
              >
                <ul className="list-none">
                  <li>
                    <label
                      className={`${visible}`}
                      htmlFor="chkusername"
                      id="chkusername"
                    >
                      Please enter username.
                    </label>
                  </li>
                </ul>
                <ul>
                  <li>
                    <label className="hidden" htmlFor="chkinvalidLogin">
                      Username or password entered is invalid.
                    </label>
                  </li>
                </ul>
              </div>
              <div className="mb-[15px] font-normal text-sm ">
                <h3 className="mt-[50px] text-left text-[#dbdbdb] text-lg">
                  <b className="font-extrabold">Username:</b>
                </h3>

                <input
                  type="text"
                  name="username"
                  id="username"
                  tabIndex={1}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  size={30}
                  className="border-[#dbdbdb] outline-none border-solid border py-[5px] pr-[15px] pl-[35px] w-full bg-[url('https://payment.bankrakyat.com.my/fpxonline/fpxui/css/images/user-silhouette.svg')] bg-3.75 bg-no-repeat bg-[10px]"
                  style={{ fontSize: 'inherit' }}
                />
              </div>
              <div className="mb-[15px] font-normal text-sm">
                <div className="mt-[25px] flex justify-between gap-5 ">
                  <button
                    className="bg-[#e9730d] disabled:opacity-50 text-white items-center py-0.5 px-[15px] border-none text-xl cursor-pointer flex justify-center w-full "
                    value="Cancel"
                    onClick={() => {
                      const expired = checkSessionExpiry(
                        false,
                        () => {
                          setCancelType('EXP');
                          cancel('E', getTxnQry.data?.data);
                        },
                        getTxnQry.data?.data
                      );
                      if (expired) {
                        return;
                      }
                      setCancelType('U');
                      cancel('U', getTxnQry?.data?.data);
                    }}
                    disabled={isClicked || updTrxMut.isLoading}
                  >
                    Cancel
                  </button>
                  <input
                    type="submit"
                    name="doSubmit"
                    id="doSubmit"
                    className="bg-[#e9730d] disabled:opacity-50 text-white items-center py-0.5 px-[15px] border-none text-xl cursor-pointer flex justify-center w-full "
                    value="Next"
                    onClick={handleSumbit}
                    tabIndex={2}
                    disabled={isClicked || updTrxMut.isLoading}
                  />
                </div>
              </div>
              <div className="problem-login-group">
                <p className="text-[#e9730d] text-sm">PROBLEM LOGIN</p>
                <a
                  className="current forgotPassword text-[#337ab7] hover:text-[#1253b5] outline-0 no-underline text-sm"
                  href="https://www2.irakyat.com.my/personal/reset/forgot_id_or_password.do"
                  target="_top"
                >
                  Forgot Username / Password
                </a>
                <br />
                <a
                  className="current changeCard text-[#337ab7] hover:text-[#1253b5] outline-0 no-underline text-sm"
                  href="https://www2.irakyat.com.my/personal/change_card/change_card.do"
                  target="_top"
                >
                  Change Card
                </a>
              </div>
              <div className="clear"></div>
            </div>
            <LoginSidebar />
          </div>
        </div>
        <LoginFooter />
      </>
    );
  } else {
    return (
      <>
        <SeparatorLine bottom={false} />
        <Header backgroundImg={true} />
        <div className="flex flex-col flex-auto h-between w-full justify-center items-center">
          Loading...
        </div>
        <LoginFooter />
      </>
    );
  }
}
