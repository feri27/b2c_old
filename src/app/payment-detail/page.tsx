'use client';
import { loginDataAtom, transactionDetailAtom } from '@/atoms';
import AccountSelection from '@/components/AccountSelection';
import Steps from '@/components/Steps';
import { account } from '@/services/account';
import { TransactionDetail } from '@/services/transaction';
import { LoginResBody, login } from '@/services/login';
import { updateTransaction } from '@/services/transaction';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAtom, useAtomValue } from 'jotai';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useEffect, useState } from 'react';

export default function PaymentDetail() {
  const router = useRouter();
  const [loginData, setLoginData] = useState<LoginResBody | null>(null);
  const [transactionDetail, setTransactionDetail] =
    useState<TransactionDetail | null>(null);
  const [showOtp, setShowOtp] = useState<boolean | null>(null);
  const [authProceed, setAuthProceed] = useState(false);

  const accountQry = useQuery({
    queryKey: ['account', loginData?.cif],
    queryFn: async () => account(loginData?.cif ?? ''),
    enabled: loginData !== null,
  });

  const updTrxMut = useMutation({
    mutationFn: updateTransaction,
    onSuccess: (data) => {
      console.log(data);
      router.push('/payment-fail');
    },
  });

  const proceedHandler = (e: FormEvent) => {
    e.preventDefault();
    if (showOtp) {
      // Call Saving/Current Acc Payment
    } else if (authProceed) {
      // Call Saving/Current Acc Payment
    } else if (!authProceed) {
      setAuthProceed(true);
    }
  };

  useEffect(() => {
    const storedLgData = localStorage.getItem('loginData');
    const storedTnxData = localStorage.getItem('transactionDetail');
    setLoginData(storedLgData ? JSON.parse(storedLgData) : null);
    setTransactionDetail(storedTnxData ? JSON.parse(storedTnxData) : null);
  }, []);

  useEffect(() => {
    if (transactionDetail && loginData) {
      if (transactionDetail.amount > loginData.mbl.trxLimit) {
        let lat: number | undefined;
        let long: number | undefined;
        if (navigator.geolocation) {
          const curPos = navigator.geolocation.getCurrentPosition((pos) => {
            lat = pos.coords.latitude;
            long = pos.coords.longitude;
          });
        }
        const latLng = `${lat} ${long}`;
        updTrxMut.mutate({
          endToEndId: 'endToEndId',
          dbtrAgt: 'dbtrAgt',
          gpsCoord: latLng,
          merchantId: transactionDetail.merchantID,
          productId: transactionDetail.productId,
        });
      } else if (transactionDetail.amount > loginData.mbl.trxLimit * 0.5) {
        setShowOtp(true);
      } else if (transactionDetail.amount < loginData.mbl.trxLimit * 0.5) {
        setShowOtp(false);
      }
    }
  }, [loginData, transactionDetail]);
  const requestTac = () => {};
  return (
    <div className="xl:max-w-[1140px] w-full sm:max-w-[540px] md:max-w-[720px] lg:[960px] mx-auto padx75 md:px-0">
      <Steps title="Payment Details" step={2} />
      <form
        // action="paymentDetails3-Success.html"
        method="post"
        onSubmit={proceedHandler}
        name="completeForm"
        autoComplete="off"
        className=" "
        target="_top"
        id="completeForm"
      >
        {/* <input type="hidden" name="SYNCHRONIZER_TOKEN" value="eec99cc3-1f82-45f4-8a7a-8c60f2f3a56f" id="SYNCHRONIZER_TOKEN"> --> */}
        {/* <input type="hidden" name="SYNCHRONIZER_URI" value="/fpxonline/fpxui/logout/show" id="SYNCHRONIZER_URI"> --> */}
        <div className="mb-[15px] bg-white border border-solid border-[#ddd] rounded shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
          <div className="py-[15px] px-[30px]">
            <AccountSelection />
            {showOtp !== null && showOtp ? (
              <div className="-mx-[15px] mb-[15px] flex flex-col md:flex-row">
                <label className="mb-[5px] w-full text-[#212529] font-bold text-sm md:w-1/3">
                  TAC :
                </label>
                <div className="flex after:clear-both md:w-2/3">
                  <div className="flex justify-between md:flex-none !flex-nowrap w-2/3 ">
                    <div className="w-[59%] md:w-1/2">
                      <input
                        onPaste={() => true}
                        type="password"
                        id="tac"
                        name="tac"
                        value=""
                        maxLength={6}
                        className="disabled:cursor-not-allowed disabled:bg-[#e9ecef] !h-[34px] !py-1.5 !px-3 !text-sm disabled:opacity-[1] select-bg !bg-none"
                        disabled
                      />
                    </div>
                    {/* <div className="w-2/5 md:w-1/2 flex justify-end">
            <button
              type="button"
              onClick={requestTac}
              id="requestTacBtn"
              name="requestTacBtn"
              className="text-[#333] leading-[1.2] inline-block bg-white border-[#ccc] cursor-pointer text-center align-middle select-none border border-solid py-1.5 px-3 text-base rounded"
            >
              Request TAC
            </button>
          </div> */}
                  </div>
                </div>
              </div>
            ) : showOtp !== null && !showOtp ? (
              <>
                <div className="-mx-[15px] mb-[15px] flex flex-col md:flex-row bg-[rgba(226,135,67,0.6)] text-sm">
                  <div className="pl-[2.5em]">
                    <div className="my-2">
                      <div className="mb-[5px] font-bold">
                        Secure Verification
                        {/*TODO: Add icon here*/}
                        <i className=""></i>
                      </div>
                      <div>
                        You will receive a notification on your smartphone to
                        approve or reject the transaction.
                      </div>
                    </div>
                  </div>
                </div>
                {authProceed && (
                  <div className="-mx-[15px] mb-[15px] flex flex-col md:flex-row text-sm">
                    <div className=" pl-[2.5em]">
                      <div>
                        Please check your iSecure registered device and approve
                        it within 50 seconds.
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div>null</div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap text-sm my-2 ">
          <div className="!mb-[15px] mt-2.5 justify-center gap-5 w-full flex cursor-pointer">
            <Link
              href="/payment-fail"
              onClick={() => {}}
              className="bg-[#f26f21] text-white py-[5px] px-[25px] border-none !rounded-md  flex justify-center items-center"
            >
              Cancel
            </Link>
            {/* <!-- <input type="submit" name="doSubmit" className="acc-selc-orange-button" value="Proceed" id="doSubmit" disabled=""> --> */}
            <input
              type="submit"
              name="doSubmit"
              className="bg-[#f26f21] cursor-pointer text-white py-[5px] px-[25px] border-none !rounded-md  flex justify-center items-center"
              value={
                authProceed
                  ? "I've approved/reject my transaction via iSecure"
                  : 'Proceed'
              }
              id="doSubmit"
            />
          </div>
        </div>
        <div>
          <p className="text-sm text-[#212529] mb-4 ">
            <strong>Note: </strong>
            <br />
            By clicking on the "Continue with Transaction" button, you will be
            redirected to the merchant site.
          </p>
        </div>
      </form>
    </div>
  );
}
