export default function Footer({
  maintenance = false,
}: {
  maintenance?: boolean;
}) {
  return (
    <footer className="bg-[#dbdbdb] ">
      <div
        className={`pt-4 ${
          maintenance
            ? 'min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] md:max-w-[720px] min-[576px]:max-w-[540px]'
            : 'w-full'
        } mx-auto padx75 pb-6 text-[15px]`}
      >
        <div className="container">
          <div className={`flex flex-col ${!maintenance && 'justify-center'}`}>
            {maintenance && (
              <div className="max-[425px]:flex justify-center">
                <img src="/images/ibiz-footer.png" width="150" />
              </div>
            )}
            <div
              className={`my-[15px] ${
                !maintenance && 'text-center'
              } leading-[1.5] flex flex-col`}
            >
              {maintenance && (
                <>
                  <ul className="mb-[5px] flex text-[#337ab7] flex-wrap justify-start  space-x-4 max-[425px]:justify-center">
                    <li>
                      <a
                        href="https://www2.irakyat.com.my/personal/welcome/welcome.do?disclaimer="
                        target="_top"
                      >
                        Disclaimer
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www2.irakyat.com.my/personal/welcome/welcome.do?clientCharter="
                        target="_top"
                      >
                        Client Charter
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www2.irakyat.com.my/personal/welcome/welcome.do?privacySecurity="
                        target="_top"
                      >
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www2.irakyat.com.my/personal/welcome/welcome.do?termsConditions="
                        target="_top"
                      >
                        Terms &amp; Conditions
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www2.irakyat.com.my/personal/welcome/welcome.do?personalDataProtectionAct="
                        target="_top"
                      >
                        Personal Data Protection Act
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www2.irakyat.com.my/personal/welcome/welcome.do?FAQ="
                        target="_top"
                      >
                        FAQ
                      </a>
                    </li>
                  </ul>
                  <br />
                </>
              )}
              <p>Copyright 2023 © Bank Rakyat. All rights reserved.</p>
              {!maintenance && (
                <>
                  <br />
                </>
              )}
              <p>
                Best viewed with the latest versions of Google Chrome, Mozilla
                Firefox, Microsoft Edge and Safari.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
