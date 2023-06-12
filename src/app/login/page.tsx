'use client';
import { securePhraseAtom, sellerDataAtom, usernameAtom } from '@/atoms';
import Steps from '@/components/Steps';
import { CheckUsernameRes, checkUsername } from '@/services/checkUsername';
import {
  GetTransactionDetail,
  TransactionDetail,
  getTransactionDetail,
} from '@/services/transaction';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useUpdateTxnMutation } from '@/hooks/useUpdateTxnMutation';
import SeparatorLine from '@/components/SeparatorLine';
import Header from '@/components/Header';
import LoginSidebar from '@/components/LoginSidebar';
import Footer from '@/components/Footer';
import LoginFooter from '@/components/LoginFooter';
import { useSetuplocalStorage } from '@/hooks/useSetupLocalStorage';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useAtom(usernameAtom);
  const [_, setSecurePhrase] = useAtom(securePhraseAtom);
  const [visible, setVisible] = useState<'hidden' | 'inline'>('hidden');

  const { dbtrAgt, endToEndId } = useAtomValue(sellerDataAtom);

  useSetuplocalStorage();

  const updTxnMut = useUpdateTxnMutation();

  const getTransactionDetailQry = useQuery({
    queryKey: ['transactionDetail', endToEndId, dbtrAgt],
    queryFn: async () =>
      getTransactionDetail({
        endToEndId: endToEndId ?? '',
        dbtrAgt: dbtrAgt ?? '',
      }),
    onSuccess: (data) => {
      const urlres = JSON.parse(localStorage.getItem('urlres')!);
      localStorage.setItem(
        'urlres',
        JSON.stringify([
          ...urlres,
          { url: '/gettransactiondetail', method: 'POST', response: data },
        ])
      );
    },
  });

  if (getTransactionDetailQry.data) {
    console.log(getTransactionDetailQry.data);
    localStorage.setItem(
      'transactionDetail',
      JSON.stringify(getTransactionDetailQry.data.data)
    );
  }

  const cancel = (txnDetail: TransactionDetail) => {
    let lat: number | undefined;
    let long: number | undefined;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        lat = pos.coords.latitude;
        long = pos.coords.longitude;
      });
    }
    const latLng = `${lat} ${long}`;
    updTxnMut.mutate({
      endToEndId: txnDetail.endToEndId,
      dbtrAgt: txnDetail.dbtrAgt,
      gpsCoord: latLng,
      merchantId: txnDetail.merchantID,
      productId: txnDetail.productId,
    });
  };

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
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSumbit = () => {
    if (!username.trim()) {
      setVisible('inline');
      return;
    } else {
      setVisible('hidden');
      checkUsernameMut.mutate(username);
    }
  };

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
                onClick={(e) => cancel(getTransactionDetailQry.data!.data)}
                disabled={checkUsernameMut.isLoading || updTxnMut.isLoading}
              />
              <input
                type="submit"
                name="doSubmit"
                id="doSubmit"
                className="bg-[#e9730d] disabled:opacity-50 text-white items-center py-0.5 px-[15px] border-none text-xl cursor-pointer flex justify-center w-full "
                value="Next"
                onClick={handleSumbit}
                tabIndex={2}
                disabled={checkUsernameMut.isLoading || updTxnMut.isLoading}
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
}
