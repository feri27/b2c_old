import Image from 'next/image';
import React from 'react';

export default function LoginSidebar() {
  return (
    <div className="md:ml-[50px]">
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
            <b className="text-[#ef5a01] font-extrabold">NEVER </b> respond to
            any phone call/ SMS/ e-mail requesting your bank account details.
          </li>
          <li className="before:content-['.'] before:absolute before:text-[#e9730d] before:-left-[15px] before:-top-[12px] before:text-[35px] text-black relative mb-[5px]">
            <b className="text-[#ef5a01] font-extrabold">NEVER </b> reveal your
            bank account details/ ATM PIN/ Internet banking password to anyone.
          </li>
          <li className="before:content-['.'] before:absolute before:text-[#e9730d] before:-left-[15px] before:-top-[12px] before:text-[35px] text-black relative mb-[5px]">
            <b className="text-[#ef5a01] font-extrabold">NEVER </b> follow
            instruction from unknown party to do banking transaction or make
            changes to your bank account details.
          </li>
          <li className="before:content-['.'] before:absolute before:text-[#e9730d] before:-left-[15px] before:-top-[12px] before:text-[35px] text-black relative mb-[5px]">
            <b className="text-[#ef5a01] font-extrabold">NEVER </b> be a victim
            of schemes that sound too good to be true.
          </li>
        </ul>
      </div>
    </div>
  );
}
