'use client';
import { securePhraseAtom, usernameAtom } from '@/atoms';
import LoginSidebar from '@/components/LoginSidebar';
import Steps from '@/components/Steps';
import crypto from 'crypto';
import { login } from '@/services/login';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { encrypt } from '@/utils/helpers';
import { useUpdateTxnMutation } from '@/hooks/useUpdateTxnMutation';
import { useTransactionDetail } from '@/hooks/useTransactionDetail';
import { useAccessToken } from '@/hooks/useAccessToken';
import { usePrivateKey } from '@/hooks/usePrivateKey';
import { TransactionDetail } from '@/services/transaction';
import SeparatorLine from '@/components/SeparatorLine';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoginFooter from '@/components/LoginFooter';

export default function SecurePhrase() {
  const router = useRouter();
  const transactionDetail = useTransactionDetail();
  const privateKeyQry = usePrivateKey();
  const loginMut = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data.notifyRes?.data.header.status === 1) {
        localStorage.setItem(
          'loginData',
          JSON.stringify(data.loginRes.data.body)
        );
        router.push('/payment-detail');
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const updTrxMut = useUpdateTxnMutation();

  const [username] = useAtom(usernameAtom);
  const accessToken = useAccessToken();
  const [password, setPassword] = useState('');
  const [errorVisible, setErrorVisible] = useState<'hidden' | 'inline'>(
    'hidden'
  );
  const [nextStepVisible, setNextStepVisible] = useState<'hidden' | 'inline'>(
    'hidden'
  );

  const [securePhrase] = useAtom(securePhraseAtom);

  const handleCheck = () => {
    setNextStepVisible('inline');
  };

  const cancel = () => {
    let lat: number | undefined;
    let long: number | undefined;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        lat = pos.coords.latitude;
        long = pos.coords.longitude;
      });
    }
    const latLng = `${lat} ${long}`;
    updTrxMut.mutate({
      endToEndId: transactionDetail?.endToEndId ?? '',
      dbtrAgt: transactionDetail?.dbtrAgt ?? '',
      gpsCoord: latLng,
      merchantId: transactionDetail?.merchantID ?? '',
      productId: transactionDetail?.productId ?? '',
    });
  };

  const handleSubmit = () => {
    if (!password.trim()) {
      setErrorVisible('inline');
      return;
    } else {
      setErrorVisible('hidden');
      if (privateKeyQry.data) {
        const secret = privateKeyQry.data.private_key;
        console.log({ secret });

        const { encryptedTxt, iv } = encrypt(password, secret);
        loginMut.mutate({
          username,
          password: encryptedTxt.toString('base64'),
          iv: iv.toString('base64'),
          accessToken,
        });
      }
    }
  };

  return (
    <>
      <SeparatorLine bottom={false} />
      <Header backgroundImg={true} />
      <div className="min-[576]-w-[41.66667%] mb-2 min-[1200px]:w-[37.3333%] flex justify-end ">
        <Steps step={1} />
      </div>
      <div className="flex flex-col min-[1200px]:max-w-[960px] min-[992px]:max-w-[890px] md:max-w-[720px] min-[576px]:max-w-[540px]  md:flex-row  items-stretch padx  mx-auto">
        <div className="p-10 md:w-5/6  bg-white shadow-sm leading-[1.5] ">
          <h3 className="text-[#e9730d] mt-0 leading-[1.2] text-center min-[1200px]-text-[1.75rem] text-[calc(1.2rem_+_0.6vw)]  mb-2 font-medium">
            Welcome to <b>iRakyat</b> Internet Banking
          </h3>
          <span className="block text-center text-sm w-full ">
            <strong>Note: </strong>
            Do not login if this is not your chosen Secure Phrase. Please
            contact our Customer Service Representative at 1-300-80-5454.
            <a
              title="The unique secure phrase below is a security measure to confirm you are in the genuine iRakyat website. Please do not enter your password if the secure phrase and background colour is incorrect."
              className="text-[#337ab7]"
            >
              {' '}
              What is Secure Phrase?
            </a>
          </span>
          <div
            id="messages"
            className="mt-1.5 pl-[22px] bg-[url('https://payment.bankrakyat.com.my/fpxonline/fpxui/css/images/ib/error.png')] bg-no-repeat text-[#a70000] text-[.67em] text-left mb-1"
          >
            <ul>
              <li>
                <label className={errorVisible} htmlFor="chkinvalidLogin">
                  Username or password entered is invalid.
                </label>
              </li>
            </ul>
          </div>
          <div className="mb-[15px] font-normal text-sm ">
            <h3 className="mt-[20px] text-left text-[#dbdbdb] text-lg">
              <b className="font-extrabold">Username:</b>
            </h3>

            <input
              type="text"
              name="username"
              id="username"
              readOnly
              tabIndex={1}
              value={username ?? ''}
              size={30}
              className=" text-black  outline-none  py-[5px] pr-[15px] pl-[35px] w-full bg-[url('https://payment.bankrakyat.com.my/fpxonline/fpxui/css/images/user-silhouette.svg')] bg-3.75 bg-no-repeat bg-[10px]"
              style={{ fontSize: 'inherit' }}
            />
          </div>
          <div className="mb-[15px] font-normal text-sm">
            <h4 className="mt-2.5 text-left text-[#dbdbdb] text-lg">
              Secure Phrase
            </h4>
            <div className="relative w-[120px] h-[35px]">
              <Image alt="secure phrase image" src={'/images/demo.jpg'} fill />
            </div>
          </div>
          <div className="mb-[15px] font-normal text-sm">
            Is this your Secure Phrase?
            <div className="flex justify-center items-center mb-5">
              <Link
                href="/login"
                className="bg-[#3879a8] text-white py-[5px] px-[25px] rounded-[50px] border-none text-base mt-[25px] mx-2.5"
                id="notSecureWordButton"
              >
                No
              </Link>
              <button
                className="bg-[#3879a8] text-white py-[5px] px-[25px] rounded-[50px] border-none text-base mt-[25px] mx-2.5 yesIsClick"
                id="isSecureWordButton"
                onClick={handleCheck}
              >
                Yes
              </button>
            </div>
          </div>

          <div className={nextStepVisible}>
            <div className="mb-[15px] font-normal text-sm ">
              <h3 className="mt-[50px] text-left text-[#dbdbdb] text-lg">
                <b className="font-extrabold">Password:</b>
              </h3>

              <input
                type="password"
                name="password"
                id="password"
                tabIndex={1}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                size={30}
                className=" text-white border-[#dbdbdb] outline-none border-solid border py-[5px] pr-[15px] pl-[35px] w-full bg-[url('https://payment.bankrakyat.com.my/fpxonline/fpxui/css/images/user-silhouette.svg')] bg-3.75 bg-no-repeat bg-[10px]"
                style={{ fontSize: 'inherit' }}
              />
            </div>
            <div className="mt-[25px] flex justify-between gap-5 ">
              <input
                type="button"
                className="bg-[#e9730d] disabled:opacity-50 text-white items-center py-0.5 px-[15px] border-none text-xl cursor-pointer flex justify-center w-full "
                data-toggle="modal"
                data-target="#myModal"
                defaultValue="Cancel"
                onClick={cancel}
                disabled={loginMut.isLoading || updTrxMut.isLoading}
              />
              <input
                type="submit"
                name="doSubmit"
                id="doSubmit"
                className="bg-[#e9730d] disabled:opacity-50  text-white items-center py-0.5 px-[15px] border-none text-xl cursor-pointer flex justify-center w-full "
                defaultValue="Login"
                onClick={handleSubmit}
                tabIndex={2}
                disabled={loginMut.isLoading || updTrxMut.isLoading}
              />
            </div>
          </div>

          <div className="my-5">
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
          <button className="text-[#337ab7] text-sm" onClick={cancel}>
            Cancel Transaction
          </button>
        </div>
        <LoginSidebar />
      </div>
      <LoginFooter />
    </>
  );
}
