import Image from 'next/image';
import React from 'react';

export default function Header({
  backgroundImg,
  logout = false,
}: {
  backgroundImg?: boolean;
  logout?: boolean;
}) {
  const justifyCenter = logout ? 'justify-end' : 'justify-center';
  return (
    <header
      className={`min-h-[100px] bg-white ${
        backgroundImg && 'bg-img mb-5 '
      } p-1.5 `}
    >
      <div className="flex items-center justify-between min-[576px]:max-w-[540px] md:max-w-[720px] min-[992px]:max-w-[890px] min-[1200px]:max-w-[960px] min-[1400px]:max-w-[1060px] min-[1600px]:max-w-[1220px] mx-auto">
        <div className=" w-1/3   p-[.25rem]">
          <div className="relative w-[80%] md:w-[50%] mt-2.5  h-10 md:h-16">
            <Image
              src="/images/iRakyat Logo.png"
              alt="iRakyat logo"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
        <div className={` w-1/3  flex ${justifyCenter} p-[.25rem]`}>
          <div className="relative w-[60%] mt-2.5  h-10 md:h-20">
            <Image
              src="/images/Bank Rakyat Logo.ai-3_BM (BLACK TAGLINE).png"
              alt="Bank Rakyat Logo"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
        {!logout && (
          <div className="w-1/3  p-[.25rem] flex justify-center md:justify-end">
            <div className="relative w-[80%] md:w-[60%]  mt-2.5  h-10 md:h-16">
              <Image
                src="/images/fpxlogo.png"
                alt="fpx logo"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
