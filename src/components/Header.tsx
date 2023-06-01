import Image from 'next/image';
import React from 'react';

export default function Header() {
  return (
    <header className="flex items-center justify-between min-h-[100px] mx-auto max-w-[1140px] p-1.5 ">
      <div className=" w-1/3  pl-[4%] p-[.25rem]">
        <div className="relative w-[80%] md:w-[60%] mt-2.5  h-10 md:h-20">
          <Image
            src="/images/iRakyat Logo.png"
            alt="iRakyat logo"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>
      <div className=" w-1/3  flex justify-center p-[.25rem]">
        <div className="relative w-[60%] mt-2.5  h-10 md:h-20">
          <Image
            src="/images/Bank Rakyat Logo.ai-3_BM (BLACK TAGLINE).png"
            alt="Bank Rakyat Logo"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>
      <div className="w-1/3  p-[.25rem] flex justify-center md:justify-end">
        <div className="relative w-[80%] md:w-[60%]  mt-2.5  h-10 md:h-20">
          <Image
            src="/images/fpxlogo.png"
            alt="fpx logo"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>
    </header>
  );
}
