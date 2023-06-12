import Image from 'next/image';
import React from 'react';

//TODO: need some work
export default function Footer() {
  return (
    <footer
      className={`before:box-border mx-auto padx bg-white mt-[50px] after:box-border block text-sm`}
    >
      <div className="min-h-[38px] pt-6 px-3.5 pb-3.5" role="contentinfo">
        <div className="flex justify-between flex-wrap items-center">
          <div className="">
            <ul className="flex flex-wrap md:justify-between justify-center mb-1.5 space-x-4">
              <li className="flex items-center my-1.5 list-none">
                <a
                  href="https://www2.irakyat.com.my/personal/welcome/welcome.do?disclaimer="
                  target="_top"
                >
                  Disclaimer
                </a>
              </li>
              <li className="flex items-center my-1.5 list-none">
                <a
                  href="https://www2.irakyat.com.my/personal/welcome/welcome.do?clientCharter="
                  target="_top"
                >
                  Client Charter
                </a>
              </li>
              <li className="flex items-center my-1.5 list-none">
                <a
                  href="https://www2.irakyat.com.my/personal/welcome/welcome.do?privacySecurity="
                  target="_top"
                >
                  Privacy Policy
                </a>
              </li>
              <li className="flex items-center my-1.5 list-none">
                <a
                  href="https://www2.irakyat.com.my/personal/welcome/welcome.do?termsConditions="
                  target="_top"
                >
                  Terms &amp; Conditions
                </a>
              </li>
              <li className="flex items-center my-1.5 list-none">
                <a
                  href="https://www2.irakyat.com.my/personal/welcome/welcome.do?personalDataProtectionAct="
                  target="_top"
                >
                  Personal Data Protection Act
                </a>
              </li>
            </ul>
            <div className="flex items-center md:justify-start justify-center">
              <div className="bg-[#f26f21] w-[50px] h-[1px] my-1.5 footer-line"></div>
            </div>

            <div className="text-center md:text-start my-2">
              Copyright 2023 © Bank Rakyat. All rights reserved.
              <br />
              Best viewed with the latest versions of Google Chrome, Mozilla
              Firefox, Microsoft Edge and Safari.
            </div>
          </div>
          <div className="mx-auto md:mx-0 my-2">
            <Image
              src="/images/mail.jpg"
              width={65}
              height={30}
              alt="Mail icon"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
