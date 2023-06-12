import Image from 'next/image';

export default function LoginFooter() {
  return (
    <footer
      className={`before:box-border bg-[#dbdbdb] mt-[50px] after:box-border block text-sm`}
    >
      <div className="min-h-[38px] pt-2.5 px-3.5 pb-[25px]" role="contentinfo">
        <div className="padx75 mx-auto min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] md:max-w-[720px] min-[576px]:max-w-[540px]">
          <div className="flex justify-between flex-wrap items-center">
            <div className="">
              <ul className="flex flex-wrap md:justify-between justify-center mb-1.5 space-x-4">
                <li className="flex items-center my-1.5 list-none border-r border-black border-solid px-[15px] text-[#337ab7]">
                  <a
                    href="https://www2.irakyat.com.my/personal/welcome/welcome.do?disclaimer="
                    target="_top"
                  >
                    Disclaimer
                  </a>
                </li>
                <li className="flex items-center my-1.5 list-none border-r border-black border-solid px-[15px] text-[#337ab7]">
                  <a
                    href="https://www2.irakyat.com.my/personal/welcome/welcome.do?clientCharter="
                    target="_top"
                  >
                    Client Charter
                  </a>
                </li>
                <li className="flex items-center my-1.5 list-none border-r border-black border-solid px-[15px] text-[#337ab7]">
                  <a
                    href="https://www2.irakyat.com.my/personal/welcome/welcome.do?privacySecurity="
                    target="_top"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li className="flex items-center my-1.5 list-none border-r border-black border-solid px-[15px] text-[#337ab7]">
                  <a
                    href="https://www2.irakyat.com.my/personal/welcome/welcome.do?termsConditions="
                    target="_top"
                  >
                    Terms &amp; Conditions
                  </a>
                </li>
                <li className="flex items-center my-1.5 list-none px-[15px] text-[#337ab7]">
                  <a
                    href="https://www2.irakyat.com.my/personal/welcome/welcome.do?personalDataProtectionAct="
                    target="_top"
                  >
                    Personal Data Protection Act
                  </a>
                </li>
              </ul>

              <div className="text-center md:text-start my-2 pl-[15px]">
                Copyright 2023 © Bank Rakyat. All rights reserved.
                <br />
                Best viewed with the latest versions of Google Chrome, Mozilla
                Firefox, Microsoft Edge and Safari.
              </div>
            </div>
            <div className="text-center flex space-x-2">
              Follow Us On
              <a
                href="https://www.facebook.com/myBANKRAKYAT"
                className="external-link"
              >
                <Image
                  src="/images/FB Icon.png"
                  width={32}
                  height={32}
                  alt="Facebook icon"
                />
              </a>
              <a
                href="https://twitter.com/intent/follow?original_referer=http%3A%2F%2Fwww.bankrakyat.com.my%2Fweb%2Fguest%2Fhome&amp;screen_name=myBankRakyat&amp;tw_p=followbutton&amp;variant=2.0"
                target="_top"
                className="external-link"
              >
                <Image
                  src="/images/Twitter Icon.png"
                  width={32}
                  height={32}
                  alt="Twitter icon"
                />
              </a>
              <a
                href="https://www.instagram.com/myBANKRAKYAT"
                className="external-link"
              >
                <Image
                  src="/images/IG Icon.png"
                  width={32}
                  height={32}
                  alt="Instagram Iion"
                />
              </a>
            </div>
            <div className="mx-auto md:mx-0 my-2 ">
              <Image
                src="/images/mail.jpg"
                width={65}
                height={30}
                alt="Mail icon"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
