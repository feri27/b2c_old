'use client';
import CountdownText from '@/components/CountdownText';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import SeparatorLine from '@/components/SeparatorLine';
import Steps from '@/components/Steps';
import { useAccessTokenAndChannel } from '@/hooks/useAccessTokenAndChannel';
import { useLogout } from '@/hooks/useLogout';
import { useLogoutOnBrowserClose } from '@/hooks/useLogoutOnBrowserClose';
import { useMerchantData } from '@/hooks/useMerchantData';
import { useTransactionDetail } from '@/hooks/useTransactionDetail';
import { formatCurrency, getLocalDateWithISOFormat } from '@/utils/helpers';
import { useState } from 'react';

export default function PaymentSuccess() {
  const transactionDetail = useTransactionDetail();
  const [_, channel, notifyAccessToken] = useAccessTokenAndChannel();
  const [controller, setController] = useState(new AbortController());
  const [isClicked, setIsClicked] = useState(false);
  const logoutMut = useLogout('/payment-success', 'C', setIsClicked);
  const merchantData = useMerchantData();
  const [currentDate, __] = useState(getLocalDateWithISOFormat());

  useLogoutOnBrowserClose(logoutMut.mutate, {
    accessToken: isClicked ? '' : notifyAccessToken,
    logoutCalled: isClicked,
    page: '/payment-success',
    dbtrAgt: transactionDetail?.dbtrAgt ?? 'BKRMMYKL',
  });
  const handleClick = () => {
    controller.abort();
    logoutMut.mutate({
      accessToken: notifyAccessToken,
      channel,
      page: '/payment-success',
      dbtrAgt: merchantData.dbtrAgt,
    });
    setIsClicked(true);
  };

  const print = () => {
    controller.abort();
    setController(new AbortController());
    window.print();
  };

  return (
    <>
      <Header />
      <SeparatorLine />
      <div className="xl:max-w-[1140px] w-full sm:max-w-[540px] md:max-w-[720px] lg:[960px] mx-auto padx md:px-0 h-between">
        <Steps title="Payment Details" step={3} />

        {/* <input type="hidden" name="SYNCHRONIZER_TOKEN" value="eec99cc3-1f82-45f4-8a7a-8c60f2f3a56f" id="SYNCHRONIZER_TOKEN"> --> */}
        {/* <input type="hidden" name="SYNCHRONIZER_URI" value="/fpxonline/fpxui/logout/show" id="SYNCHRONIZER_URI"> --> */}
        <div className="mb-[15px] bg-white border border-solid border-[#ddd] rounded ">
          <div className="py-[15px] px-[30px] text-sm ">
            <div className="-mx-[15px] mb-[25px] block">
              <p className="mb-4 hide-when-print">
                Your account <strong>has been deducted</strong>.
              </p>
              <p className=" mb-4 hide-when-print">
                <strong>Important Note:</strong>
                <br />
                1. Please check with your Merchant on the final status of your
                payment.
                <br />
                2. Please DO NOT close the browser until final receipt by the
                Merchant is displayed.
              </p>
            </div>
            <div className="-mx-[15px] mb-[15px] flex flex-col md:flex-row">
              <label className="mb-[5px] text-[#212529] font-bold md:w-1/3">
                Transaction Status :
              </label>
              <div className="w-full md:w-2/3">
                <div id="accountSummary">
                  <div className="flex w-full flex-wrap ">
                    <div className="md:w-2/3">Successful</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="-mx-[15px] mb-[15px] flex flex-col md:flex-row">
              <label className="mb-[5px] text-[#212529] font-bold text-sm md:w-1/3">
                Date &amp; Time :
              </label>
              <div className="flex after:clear-both md:w-2/3">
                <div className="flex flex-wrap">
                  <p className="">{currentDate}</p>
                </div>
              </div>
            </div>
            <div className="-mx-[15px] mb-[15px] flex flex-col md:flex-row">
              <label className="mb-[5px] text-[#212529] font-bold text-sm md:w-1/3">
                Reference Number :
              </label>
              <div className="flex after:clear-both md:w-2/3">
                <div className="flex flex-wrap">
                  <p className="">{transactionDetail?.recipientReference}</p>
                </div>
              </div>
            </div>
            <div className="-mx-[15px] mb-[15px] flex flex-col md:flex-row">
              <label className="mb-[5px] text-[#212529] font-bold text-sm md:w-1/3">
                Pay To :
              </label>
              <div className="flex after:clear-both md:w-2/3">
                <div className="flex flex-wrap">
                  <p className="">{transactionDetail?.creditorName}</p>
                </div>
              </div>
            </div>
            <div className="-mx-[15px] mb-[15px] flex flex-col md:flex-row">
              <label className="mb-[5px] text-[#212529] font-bold text-sm md:w-1/3">
                Transaction Amount :
              </label>
              <div className="flex after:clear-both md:w-2/3">
                <div className="flex flex-wrap">
                  <p className="">
                    MYR {formatCurrency(Number(transactionDetail?.amount))}
                  </p>
                </div>
              </div>
            </div>
            <div className="-mx-[15px] mb-[15px] flex flex-col md:flex-row">
              <label className="mb-[5px] text-[#212529] font-bold text-sm md:w-1/3">
                OBW Message ID :
              </label>
              <div className="flex after:clear-both md:w-2/3">
                <div className="flex flex-wrap">
                  <p className="">{transactionDetail?.msgId}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex  justify-center text-sm my-2 ">
          <div className="!mb-[15px] flex-wrap mt-2.5 justify-center gap-5 w-full flex cursor-pointer">
            <input
              type="button"
              onClick={print}
              defaultValue="Print"
              disabled={isClicked}
              className="bg-[#f26f21]  w-full disabled:opacity-50 min-[480px]:w-auto cursor-pointer text-white py-[5px] px-[25px] border-none !rounded-md  flex justify-center items-center"
            />

            {/* <!-- <input type="submit" name="doSubmit" className="acc-selc-orange-button" value="Proceed" id="doSubmit" disabled=""> --> */}
            <button
              className="bg-[#f26f21]  w-full min-[480px]:w-auto disabled:opacity-50 cursor-pointer text-white py-[5px] px-[25px] border-none !rounded-md  flex justify-center items-center"
              id="doSubmit"
              disabled={isClicked}
              onClick={handleClick}
            >
              <CountdownText
                cb={handleClick}
                controller={controller}
                count={300}
              />
            </button>
          </div>
        </div>
        <div>
          <p className="text-sm text-[#212529] mb-4 ">
            <strong>Note: </strong>
            <br />
            By clicking on the &quot;Continue with Transaction&quot; button, you
            will be redirected to the merchant site.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
