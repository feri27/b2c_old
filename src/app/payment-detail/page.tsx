'use client';
import AccountSelection from '@/components/AccountSelection';
import Steps from '@/components/Steps';
import { account, accountPayment } from '@/services/account';
import {
  authorizeTransaction,
  notifyTransaction,
} from '@/services/transaction';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { verifyOTP } from '@/services/veritfyOtp';
import { encrypt } from '@/utils/helpers';
import { useTransactionDetail } from '@/hooks/useTransactionDetail';
import { useLoginData } from '@/hooks/useLoginData';
import { useAccessTokenAndChannel } from '@/hooks/useAccessTokenAndChannel';
import { usePrivateKey } from '@/hooks/usePrivateKey';
import SeparatorLine from '@/components/SeparatorLine';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BsFillInfoCircleFill } from 'react-icons/bs';
import CountdownText from '@/components/CountdownText';
import { useSetuplocalStorage } from '@/hooks/useSetupLocalStorage';
import { useIsSessionActive } from '@/hooks/useIsSessionActive';
import { useCancelTransaction } from '@/hooks/useCancelTransaction';
import Modal from '@/components/common/Modal';

const abortController = new AbortController();

export default function PaymentDetail() {
  const router = useRouter();
  const [accessToken, channel] = useAccessTokenAndChannel();
  const [isActive, setIsActive] = useState<boolean>(true);

  const { cancel, updTrxMut } = useCancelTransaction({
    page: '/payment-detail',
  });

  const loginData = useLoginData();
  const transactionDetail = useTransactionDetail();
  const [showOtp, setShowOtp] = useState<boolean | null>(null);
  const [otp, setOtp] = useState<string>('');
  const [authProceed, setAuthProceed] = useState(false);
  const privateKeyQry = usePrivateKey();
  const [accountType, setAccountType] = useState('SVGS');
  const [isClicked, setIsClicked] = useState(false);
  useIsSessionActive(setIsActive);

  useSetuplocalStorage();

  const accountQry = useQuery({
    queryKey: ['account', loginData?.cif],
    queryFn: async () => account(loginData?.cif ?? ''),
    enabled: loginData?.cif !== undefined,
    onSuccess: (data) => {
      if (data)
        authorizeTxnMut.mutate({
          accessToken,
          creditorName: transactionDetail?.merchantName ?? '',
          fromAccountHolder: data.data.accHolderName,
          fromAccountNo: data.data.accNo,
          referenceNo: transactionDetail?.recipientReference ?? '',
          totalAmount: transactionDetail?.amount ?? 0,
          transactionNo: transactionDetail?.tnxId ?? '',
          trxAmount: transactionDetail?.amount ?? 0,
          trxTimestamp: transactionDetail?.currentDT ?? '',
          channel,
        });
      const urlres = JSON.parse(localStorage.getItem('urlres')!);
      localStorage.setItem(
        'urlres',
        JSON.stringify([
          ...urlres,
          { url: '/account', method: 'GET', response: data },
        ])
      );
    },
  });

  const authorizeTxnMut = useMutation({
    mutationFn: authorizeTransaction,
    onSuccess: (data) => {
      const urlres = JSON.parse(localStorage.getItem('urlres')!);
      localStorage.setItem(
        'urlres',
        JSON.stringify([
          ...urlres,
          { url: '/authorizetransaction', method: 'POST', response: data },
        ])
      );
    },
  });
  const notifyTxnMut = useMutation({
    mutationFn: notifyTransaction,
    onSuccess: (data) => {
      const urlres = JSON.parse(localStorage.getItem('urlres')!);
      localStorage.setItem(
        'urlres',
        JSON.stringify([
          ...urlres,
          { url: '/notifytransaction', method: 'POST', response: data },
        ])
      );

      router.push('/payment-success');
    },
    onError: () => {
      setIsClicked(false);
    },
  });

  const accPaymentMut = useMutation({
    mutationFn: accountPayment,
    onSuccess: (data) => {
      const urlres = JSON.parse(localStorage.getItem('urlres')!);
      localStorage.setItem(
        'urlres',
        JSON.stringify([
          ...urlres,
          {
            url: '/savingaccountpayment or /currentaccountpayment',
            method: 'POST',
            response: data,
          },
        ])
      );

      if (accountQry.data)
        notifyTxnMut.mutate({
          accessToken: accessToken ?? '',
          fromAccountHolder: accountQry.data.data.accHolderName,
          fromAccountNo: accountQry.data.data.accNo,
          referenceNo: transactionDetail?.recipientReference ?? '',
          totalAmount: transactionDetail?.amount ?? 0,
          transactionNo: transactionDetail?.tnxId ?? '',
          trxAmount: transactionDetail?.amount ?? 0,
          trxTimestamp: transactionDetail?.currentDT ?? '',
          sellerName: transactionDetail?.merchantName ?? '',
          trxStatus: 'S',
          channel,
        });
    },
    onError: () => {
      setIsClicked(false);
    },
  });

  const verifyOTPMut = useMutation({
    mutationFn: verifyOTP,
    onSuccess: (data) => {
      const urlres = JSON.parse(localStorage.getItem('urlres')!);
      localStorage.setItem(
        'urlres',
        JSON.stringify([
          ...urlres,
          { url: '/verifyotp', method: 'POST', response: data },
        ])
      );

      if (accountQry.data)
        accPaymentMut.mutate({
          body: {
            actNo: accountQry.data.data.accNo,
            addenda: transactionDetail?.paymentDescription ?? '',
            sellerId: transactionDetail?.merchantID ?? '',
            sellerOdNo: transactionDetail?.recipientReference ?? '',
            senderName: transactionDetail?.merchantName ?? '',
            trxAmt: transactionDetail?.amount ?? 0,
          },
          saving: accountType === 'SVGS',
        });
    },
    onError: () => {
      setIsClicked(false);
    },
  });

  const proceedHandler = (e: FormEvent) => {
    e.preventDefault();
    if (showOtp) {
      const secret = privateKeyQry.data?.private_key ?? '';
      const { encryptedTxt, iv } = encrypt(otp, secret);
      verifyOTPMut.mutate({
        accessToken,
        iv: iv.toString('base64'),
        otp: encryptedTxt.toString('base64'),
        channel,
      });
      setIsClicked(true);
    } else if (authProceed) {
      abortController.abort();
      if (accountQry.data) {
        accPaymentMut.mutate({
          body: {
            actNo: accountQry.data.data.accNo,
            addenda: transactionDetail?.paymentDescription ?? '',
            sellerId: transactionDetail?.merchantID ?? '',
            sellerOdNo: transactionDetail?.recipientReference ?? '',
            senderName: transactionDetail?.merchantName ?? '',
            trxAmt: transactionDetail?.amount ?? 0,
          },
          saving: transactionDetail?.merchantAccountType[0] === 'SVGS',
        });
        setIsClicked(true);
      }
    } else if (!authProceed) {
      setAuthProceed(true);
    }
  };

  useEffect(() => {
    if (transactionDetail && loginData) {
      if (transactionDetail.amount > loginData.mbl.trxLimit) {
        cancel('UL', transactionDetail);
      } else if (transactionDetail.amount > loginData.mbl.trxLimit * 0.5) {
        setShowOtp(true);
      } else if (transactionDetail.amount < loginData.mbl.trxLimit * 0.5) {
        setShowOtp(false);
      }
    }
  }, [loginData, transactionDetail, cancel]);

  if (!isActive) {
    return (
      <>
        <Header />
        <SeparatorLine />
        <div className="h-between-b2b"></div>
        <Modal
          text="Your session has expired"
          isLoading={updTrxMut.isLoading}
          cb={() => cancel('E', transactionDetail)}
        />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <SeparatorLine />
      <div className="xl:max-w-[1140px] w-full sm:max-w-[540px] md:max-w-[720px] lg:[960px] mx-auto padx md:px-0">
        <Steps title="Payment Details" step={2} />
        <form
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
              <AccountSelection
                clicked={authProceed}
                accType={accountType}
                setAccType={setAccountType}
                data={transactionDetail}
              />
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
                          type="number"
                          id="tac"
                          name="tac"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          maxLength={6}
                          className="disabled:cursor-not-allowed disabled:bg-[#e9ecef] !h-[34px] !py-1.5 !px-3 !text-sm disabled:opacity-[1] select-bg !bg-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : showOtp !== null && !showOtp ? (
                <>
                  <div className="-mx-[15px] mb-[15px] flex flex-col md:flex-row bg-[rgba(226,135,67,0.6)] text-sm">
                    <div className="pl-[2.5em]">
                      <div className="my-2">
                        <div className="mb-[5px] font-bold flex  space-x-1">
                          <p>Secure Verification</p>
                          <BsFillInfoCircleFill size={13} className="mt-0.5" />
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
                        <CountdownText
                          count={50}
                          isNote={true}
                          controller={abortController}
                        />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p></p>
              )}
            </div>
          </div>
          <div className=" text-sm my-2 ">
            <div className="!mb-[15px] flex-wrap mt-2.5 justify-center gap-5 w-full padx flex">
              <input
                type="button"
                onClick={(e) => cancel('U', transactionDetail)}
                disabled={isClicked || updTrxMut.isLoading}
                defaultValue="Cancel"
                className="bg-[#f26f21] disabled:opacity-50 cursor-pointer text-white py-[5px] px-[25px] border-none w-full min-[480px]:w-auto !rounded-md   flex justify-center items-center"
              />

              {/* <!-- <input type="submit" name="doSubmit" className="acc-selc-orange-button" value="Proceed" id="doSubmit" disabled=""> --> */}
              <input
                type="submit"
                name="doSubmit"
                className="bg-[#f26f21] disabled:opacity-50 cursor-pointer text-white py-[5px] px-[25px] w-full min-[480px]:w-auto border-none !rounded-md  flex justify-center items-center"
                value={
                  authProceed
                    ? "I've approved/reject my transaction via iSecure"
                    : 'Proceed'
                }
                disabled={isClicked || updTrxMut.isLoading}
                id="doSubmit"
              />
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}
