'use client';
import AccountSelection from '@/components/AccountSelection';
import Steps from '@/components/Steps';
import { account, accountPayment } from '@/services/account';
import {
  TransactionDetail,
  authorizeTransaction,
  notifyTransaction,
} from '@/services/transaction';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useEffect, useLayoutEffect, useState } from 'react';
import { verifyOTP } from '@/services/veritfyOtp';
import { encrypt } from '@/utils/helpers';
import { useUpdateTxnMutation } from '@/hooks/useUpdateTxnMutation';
import { useTransactionDetail } from '@/hooks/useTransactionDetail';
import { useLoginData } from '@/hooks/useLoginData';
import { useAccessToken } from '@/hooks/useAccessToken';
import { usePrivateKey } from '@/hooks/usePrivateKey';

export default function PaymentDetail() {
  const router = useRouter();
  const loginData = useLoginData();
  const transactionDetail = useTransactionDetail();
  const [showOtp, setShowOtp] = useState<boolean | null>(null);
  const [otp, setOtp] = useState<string>('');
  const [authProceed, setAuthProceed] = useState(false);
  const accessToken = useAccessToken();
  const privateKeyQry = usePrivateKey();

  const accountQry = useQuery({
    queryKey: ['account', loginData?.cif],
    queryFn: async () => account(loginData?.cif ?? ''),
  });

  const updTrxMut = useUpdateTxnMutation();

  const authorizeTxnMut = useMutation({
    mutationFn: authorizeTransaction,
    onSuccess: (data) => {
      console.log(data);
    },
  });
  const notifyTxnMut = useMutation({
    mutationFn: notifyTransaction,
    onSuccess: (data) => {
      console.log('here in no');
      router.push('/payment-success');
    },
  });

  const accPaymentMut = useMutation({
    mutationFn: accountPayment,
    onSuccess: (data) => {
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
        });
    },
  });

  const verifyOTPMut = useMutation({
    mutationFn: verifyOTP,
    onSuccess: (data) => {
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
          saving: transactionDetail?.merchantAccountType === 'SVGS',
        });
    },
  });

  useEffect(() => {
    if (accountQry.data?.data.accNo && accountQry.data.data.accHolderName) {
      authorizeTxnMut.mutate({
        accessToken,
        creditorName: transactionDetail?.merchantName ?? '',
        fromAccountHolder: accountQry.data.data.accHolderName,
        fromAccountNo: accountQry.data.data.accNo,
        referenceNo: transactionDetail?.recipientReference ?? '',
        totalAmount: transactionDetail?.amount ?? 0,
        transactionNo: transactionDetail?.tnxId ?? '',
        trxAmount: transactionDetail?.amount ?? 0,
        trxTimestamp: transactionDetail?.currentDT ?? '',
      });
    }
  }, [accountQry.data?.data.accNo, accountQry.data?.data.accHolderName]);

  const proceedHandler = (e: FormEvent) => {
    e.preventDefault();
    if (showOtp) {
      const secret = privateKeyQry.data?.private_key ?? '';
      const { encryptedTxt, iv } = encrypt(otp, secret);
      verifyOTPMut.mutate({
        accessToken,
        iv: iv.toString('base64'),
        otp: encryptedTxt.toString('base64'),
      });
    } else if (authProceed) {
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
          saving: transactionDetail?.merchantAccountType === 'SVGS',
        });
      }
    } else if (!authProceed) {
      setAuthProceed(true);
    }
  };

  const cancel = (txnDetail: TransactionDetail) => {
    let lat: number | undefined;
    let long: number | undefined;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        lat = pos.coords.latitude;
        long = pos.coords.longitude;
      });
    }
    const latLng = `${lat} ${long}`;
    updTrxMut.mutate({
      endToEndId: txnDetail.endToEndId,
      dbtrAgt: txnDetail.dbtrAgt,
      gpsCoord: latLng,
      merchantId: txnDetail.merchantID,
      productId: txnDetail.productId,
    });
  };

  useEffect(() => {
    if (transactionDetail && loginData) {
      if (transactionDetail.amount > loginData.mbl.trxLimit) {
        cancel(transactionDetail);
      } else if (transactionDetail.amount > loginData.mbl.trxLimit * 0.5) {
        setShowOtp(true);
      } else if (transactionDetail.amount < loginData.mbl.trxLimit * 0.5) {
        setShowOtp(false);
      }
    }
  }, [loginData, transactionDetail]);
  return (
    <div className="xl:max-w-[1140px] w-full sm:max-w-[540px] md:max-w-[720px] lg:[960px] mx-auto padx md:px-0">
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
            <AccountSelection data={transactionDetail} />
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
        <div className=" text-sm my-2 ">
          <div className="!mb-[15px] flex-wrap mt-2.5 justify-center gap-5 w-full padx flex">
            <input
              type="button"
              onClick={(e) => cancel(transactionDetail!)}
              disabled={
                verifyOTPMut.isLoading ||
                accPaymentMut.isLoading ||
                notifyTxnMut.isLoading ||
                updTrxMut.isLoading
              }
              defaultValue="Cancel"
              className="bg-[#f26f21] disabled:opacity-50 cursor-pointer text-white py-[5px] px-[25px] border-none w-full min-[480px]:w-auto !rounded-md   flex justify-center items-center"
            />

            {/* <!-- <input type="submit" name="doSubmit" className="acc-selc-orange-button" value="Proceed" id="doSubmit" disabled=""> --> */}
            <input
              type="submit"
              name="doSubmit"
              className="bg-[#f26f21] disabled:opacity-50 cursor-pointer text-white py-[5px] px-[25px] w-full min-[480px]:w-auto border-none !rounded-md  flex justify-center items-center"
              defaultValue={
                authProceed
                  ? "I've approved/reject my transaction via iSecure"
                  : 'Proceed'
              }
              disabled={
                verifyOTPMut.isLoading ||
                accPaymentMut.isLoading ||
                notifyTxnMut.isLoading ||
                updTrxMut.isLoading
              }
              id="doSubmit"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
