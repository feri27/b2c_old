'use client';
import AccountSelection from '@/components/AccountSelection';
import Steps from '@/components/Steps';
import { account, accountPayment } from '@/services/account';
import {
  authorizeTransaction,
  checkTxnStatus,
  notifyTransaction,
} from '@/services/transaction';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { verifyOTP } from '@/services/veritfyOtp';
import { encrypt, getSessionID } from '@/utils/helpers';
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
import { useGetMFA } from '@/hooks/useGetMFA';
import { Socket, io } from 'socket.io-client';
import { useCheckMaintenaceTime } from '@/hooks/useCheckMaintenaceTime';
import { debit } from '@/services/debit';
import { useMerchantData } from '@/hooks/useMerchantData';
import { useUpdateTxnMutation } from '@/hooks/useUpdateTxnMutation';

const abortController = new AbortController();

export default function PaymentDetail() {
  const router = useRouter();
  const [accessToken, channel] = useAccessTokenAndChannel();
  const [isActive, setIsActive] = useState<boolean>(true);
  const [socket, setSocket] = useState<Socket | undefined>();
  const { cancel, updTrxMut } = useCancelTransaction({
    page: '/payment-detail',
  });
  const updateTxnMut = useUpdateTxnMutation(false, '');
  useCheckMaintenaceTime('B2C');
  const loginData = useLoginData();
  const transactionDetail = useTransactionDetail();
  const [timerOff, setTimerOff] = useState<boolean>(false);
  const [maSubmit, setMASubmit] = useState<{ limit: number; count: number }>({
    limit: 1,
    count: 0,
  });
  const [otp, setOtp] = useState<string>('');
  const [authProceed, setAuthProceed] = useState(false);
  const privateKeyQry = usePrivateKey();
  const [accountType, setAccountType] = useState('SVGS');
  const [isClicked, setIsClicked] = useState(false);
  const [moClicked, setMoClicked] = useState(false);
  const merchantData = useMerchantData();
  useIsSessionActive(() => {
    cancel('E', transactionDetail);
    sessionStorage.setItem('exp', 'true');
  });
  const mfa = useGetMFA();
  useSetuplocalStorage();

  const accountQry = useQuery({
    queryKey: ['account', loginData?.cif],
    queryFn: async () => account(loginData?.cif ?? ''),
    enabled: loginData?.cif !== undefined,
    onSuccess: (data) => {},
  });

  useEffect(() => {
    if ((mfa?.method === 'NIL', mfa?.method === 'NR')) {
      cancel('MFA', transactionDetail);
    }
  }, [mfa?.method]);

  const mfaMethod = mfa?.method;
  const requestButtonText =
    mfaMethod === 'SMS' || mfaMethod === 'MA'
      ? 'Request TAC'
      : mfaMethod === 'MO'
      ? 'Request ISecure OTP'
      : '';

  useEffect(() => {
    if (transactionDetail?.sourceOfFunds !== '') {
      cancel('ALF', transactionDetail);
    }
  }, [transactionDetail?.sourceOfFunds]);

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
      router.push('/payment-success');
    },
    onError: () => {
      router.push('/payment-success');
      setIsClicked(false);
    },
  });
  const debitMut = useMutation({
    mutationFn: debit,
    onSuccess: (data) => {
      if (
        data.PymtConfirmRs.resBody.TxSts === 'ACTC' ||
        data.PymtConfirmRs.resBody.TxSts === 'ACSP'
      ) {
        router.push('/payment-success');
      } else {
        const sessionID = getSessionID();
        updateTxnMut.mutate({
          dbtrAgt: merchantData.dbtrAgt,
          endToEndId: merchantData.endToEndId,
          gpsCoord: '',
          merchantId: merchantData.msgId,
          page: '/payment-detail',
          reason: 'MFA',
          sessionID,
          channel,
          amount:
            transactionDetail !== null
              ? transactionDetail.amount.toString()
              : '',
          payerName: transactionDetail?.payerName ?? '',
          cdtrAgtBIC: transactionDetail?.cdtrAgtBIC ?? '',
          dbtrAcctId: transactionDetail?.dbtrAcctId ?? '',
          dbtrAgtBIC: transactionDetail?.dbtrAgtBIC ?? '',
        });
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
            sellerName: transactionDetail?.creditorName ?? '',
            trxStatus: 'S',
            channel,
          });
      }
    },
    onError: () => {
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
          sellerName: transactionDetail?.creditorName ?? '',
          trxStatus: 'S',
          channel,
        });
    },
  });

  const checkTxnStatusMut = useMutation({
    mutationFn: checkTxnStatus,
    onSuccess: (data) => {
      if (maSubmit.count >= 3 && maSubmit.count >= maSubmit.limit) {
        cancel('MFA', transactionDetail);
      }
      const approvalStatus = data.data.body.approvalStatus;
      if (
        approvalStatus === 'R' ||
        approvalStatus === 'F' ||
        approvalStatus === 'C'
      ) {
        cancel('ALF', transactionDetail);
      } else if (approvalStatus === 'P') {
        setMASubmit((prev) => ({ ...prev, limit: 3 }));
      } else if (approvalStatus === 'A') {
        if (transactionDetail && merchantData) {
          debitMut.mutate({
            bizSvc: transactionDetail.bizSvc,
            cdtrAcctId: transactionDetail.cdtrAcctId,
            cdtrAcctTp: transactionDetail.cdtrAcctTp,
            cdtrAgtBIC: transactionDetail.cdtrAgtBIC,
            cdtrNm: transactionDetail.creditorName,
            channel: 'B2C',
            dbtrAcctId: transactionDetail.dbtrAcctId,
            dbtrAcctTp: transactionDetail.dbtrAcctTp,
            dbtrAgtBIC: transactionDetail.dbtrAgtBIC,
            dbtrNm: transactionDetail.payerName,
            frBIC: transactionDetail.frBIC,
            instgAgtBIC: merchantData.dbtrAgt,
            interBkSttlmAmt: String(transactionDetail.amount),
            recptRef: transactionDetail.recipientReference,
            toBIC: transactionDetail.toBIC,
            txId: merchantData.endToEndId,
          });
        }
      }
    },
    onError: () => {
      setIsClicked(false);
    },
  });

  useEffect(() => {
    return () => {
      socket?.disconnect();
    };
  }, []);

  // const accPaymentMut = useMutation({
  //   mutationFn: accountPayment,
  //   onSuccess: (data) => {
  //     if (accountQry.data)
  //       notifyTxnMut.mutate({
  //         accessToken: accessToken ?? '',
  //         fromAccountHolder: accountQry.data.data.accHolderName,
  //         fromAccountNo: accountQry.data.data.accNo,
  //         referenceNo: transactionDetail?.recipientReference ?? '',
  //         totalAmount: transactionDetail?.amount ?? 0,
  //         transactionNo: transactionDetail?.tnxId ?? '',
  //         trxAmount: transactionDetail?.amount ?? 0,
  //         trxTimestamp: transactionDetail?.currentDT ?? '',
  //         sellerName: transactionDetail?.creditorName ?? '',
  //         trxStatus: 'S',
  //         channel,
  //       });
  //   },
  //   onError: () => {
  //     setIsClicked(false);
  //   },
  // });

  const verifyOTPMut = useMutation({
    mutationFn: verifyOTP,
    onSuccess: (data) => {
      if (data.status !== 1 || data.errorId) {
        cancel('MFA', transactionDetail);
      } else {
        if (accountQry.data)
          if (transactionDetail && merchantData) {
            // accPaymentMut.mutate({
            //   body: {
            //     actNo: accountQry.data.data.accNo,
            //     addenda: transactionDetail?.recipientReference ?? '',
            //     sellerId: transactionDetail?.merchantID ?? '',
            //     sellerOdNo: transactionDetail?.recipientReference ?? '',
            //     senderName: transactionDetail?.creditorName ?? '',
            //     trxAmt: transactionDetail?.amount ?? 0,
            //   },
            //   saving: accountType === 'SVGS',
            // });
            debitMut.mutate({
              bizSvc: transactionDetail.bizSvc,
              cdtrAcctId: transactionDetail.cdtrAcctId,
              cdtrAcctTp: transactionDetail.cdtrAcctTp,
              cdtrAgtBIC: transactionDetail.cdtrAgtBIC,
              cdtrNm: transactionDetail.creditorName,
              channel: 'B2C',
              dbtrAcctId: transactionDetail.dbtrAcctId,
              dbtrAcctTp: transactionDetail.dbtrAcctTp,
              dbtrAgtBIC: transactionDetail.dbtrAgtBIC,
              dbtrNm: transactionDetail.payerName,
              frBIC: transactionDetail.frBIC,
              instgAgtBIC: merchantData.dbtrAgt,
              interBkSttlmAmt: String(transactionDetail.amount),
              recptRef: transactionDetail.recipientReference,
              toBIC: transactionDetail.toBIC,
              txId: merchantData.endToEndId,
            });
          }
      }
    },
    onError: () => {
      setIsClicked(false);
    },
  });

  const handleSMSRequest = () => {
    return;
  };
  const handleMORequest = () => {
    authorizeTxnMut.mutate({
      accessToken,
      creditorName: transactionDetail?.creditorName ?? '',
      fromAccountHolder: accountQry.data?.data.accHolderName!,
      fromAccountNo: accountQry.data?.data.accNo!,
      referenceNo: transactionDetail?.recipientReference ?? '',
      totalAmount: transactionDetail?.amount ?? 0,
      transactionNo: transactionDetail?.tnxId ?? '',
      trxAmount: transactionDetail?.amount ?? 0,
      trxTimestamp: transactionDetail?.currentDT ?? '',
      channel,
      method: mfaMethod ?? 'MO',
    });
    setMoClicked(true);
    return;
  };

  const proceedHandler = (e: FormEvent) => {
    e.preventDefault();
    if ((mfaMethod === 'SMS' || mfaMethod === 'MO') && !otp) {
      return;
    }
    if (mfaMethod === 'SMS') {
      if (otp === '123456') {
        // accPaymentMut.mutate({
        //   body: {
        //     actNo: accountQry.data?.data.accNo!,
        //     addenda: transactionDetail?.recipientReference ?? '',
        //     sellerId: transactionDetail?.merchantID ?? '',
        //     sellerOdNo: transactionDetail?.recipientReference ?? '',
        //     senderName: transactionDetail?.creditorName ?? '',
        //     trxAmt: transactionDetail?.amount ?? 0,
        //   },
        //   saving: accountType === '01',
        // });
        if (transactionDetail && merchantData) {
          debitMut.mutate({
            bizSvc: transactionDetail.bizSvc,
            cdtrAcctId: transactionDetail.cdtrAcctId,
            cdtrAcctTp: transactionDetail.cdtrAcctTp,
            cdtrAgtBIC: transactionDetail.cdtrAgtBIC,
            cdtrNm: transactionDetail.creditorName,
            channel: 'B2C',
            dbtrAcctId: transactionDetail.dbtrAcctId,
            dbtrAcctTp: transactionDetail.dbtrAcctTp,
            dbtrAgtBIC: transactionDetail.dbtrAgtBIC,
            dbtrNm: transactionDetail.payerName,
            frBIC: transactionDetail.frBIC,
            instgAgtBIC: merchantData.dbtrAgt,
            interBkSttlmAmt: String(transactionDetail.amount),
            recptRef: transactionDetail.recipientReference,
            toBIC: transactionDetail.toBIC,
            txId: merchantData.endToEndId,
          });
        }
        setIsClicked(true);
      } else {
        cancel('MFA', transactionDetail);
        setIsClicked(true);
      }
    } else if (mfaMethod === 'MO') {
      abortController.abort();
      const secret = privateKeyQry.data?.private_key ?? '';
      const { encryptedTxt, iv } = encrypt(otp, secret);
      verifyOTPMut.mutate({
        accessToken,
        iv: iv.toString('base64'),
        otp: encryptedTxt.toString('base64'),
        channel,
        deliveryChannel: mfaMethod,
      });
      setIsClicked(true);
    } else if (mfaMethod === 'MA') {
      // abortController.abort();
      console.log('here');

      setMASubmit((prev) => ({ ...prev, count: prev.count++ }));
      if (accountQry.data) {
        authorizeTxnMut.mutate({
          accessToken,
          creditorName: transactionDetail?.creditorName ?? '',
          fromAccountHolder: accountQry.data.data.accHolderName,
          fromAccountNo: accountQry.data.data.accNo,
          referenceNo: transactionDetail?.recipientReference ?? '',
          totalAmount: transactionDetail?.amount ?? 0,
          transactionNo: transactionDetail?.tnxId ?? '',
          trxAmount: transactionDetail?.amount ?? 0,
          trxTimestamp: transactionDetail?.currentDT ?? '',
          channel,
          method: mfaMethod,
        });
      }
      if (maSubmit.count > 0) {
        checkTxnStatusMut.mutate({
          accessToken,
          channel,
          page: '/payment-detail',
          refNo: transactionDetail?.recipientReference!,
          txnID: transactionDetail?.tnxId!,
        });
      }
      let newSocket = socket;
      if (!newSocket) {
        newSocket = io('http://http://54.169.180.154:5000');
        setSocket(newSocket);
        newSocket.emit('start', { txnID: transactionDetail?.tnxId });
      }

      newSocket.on('data', (data) => {
        const status = data['status'];
        if (status !== 1) {
          cancel('TO', transactionDetail);
        } else {
          if (transactionDetail && merchantData) {
            debitMut.mutate({
              bizSvc: transactionDetail.bizSvc,
              cdtrAcctId: transactionDetail.cdtrAcctId,
              cdtrAcctTp: transactionDetail.cdtrAcctTp,
              cdtrAgtBIC: transactionDetail.cdtrAgtBIC,
              cdtrNm: transactionDetail.creditorName,
              channel: 'B2C',
              dbtrAcctId: transactionDetail.dbtrAcctId,
              dbtrAcctTp: transactionDetail.dbtrAcctTp,
              dbtrAgtBIC: transactionDetail.dbtrAgtBIC,
              dbtrNm: transactionDetail.payerName,
              frBIC: transactionDetail.frBIC,
              instgAgtBIC: merchantData.dbtrAgt,
              interBkSttlmAmt: String(transactionDetail.amount),
              recptRef: transactionDetail.recipientReference,
              toBIC: transactionDetail.toBIC,
              txId: merchantData.endToEndId,
            });
          }
        }
        newSocket?.disconnect();
      });
      // if (accountQry.data) {
      //   accPaymentMut.mutate({
      //     body: {
      //       actNo: accountQry.data.data.accNo,
      //       addenda: transactionDetail?.recipientReference ?? '',
      //       sellerId: transactionDetail?.merchantID ?? '',
      //       sellerOdNo: transactionDetail?.recipientReference ?? '',
      //       senderName: transactionDetail?.creditorName ?? '',
      //       trxAmt: transactionDetail?.amount ?? 0,
      //     },
      //     saving: transactionDetail?.merchantAccountType[0] === 'SVGS',
      //   });
      // }
      // setIsClicked(true);
    }
  };

  // useEffect(() => {
  //   if (transactionDetail && loginData) {
  //     if (transactionDetail.amount > loginData.mbl.trxLimit) {
  //       cancel('UL', transactionDetail);
  //     } else if (transactionDetail.amount > loginData.mbl.trxLimit * 0.5) {
  //       // setShowOtp(true);
  //     } else if (transactionDetail.amount < loginData.mbl.trxLimit * 0.5) {
  //       // setShowOtp(false);
  //     }
  //   }
  // }, [loginData, transactionDetail, cancel]);

  useEffect(() => {
    if (transactionDetail && loginData) {
      if (transactionDetail.amount > loginData.mbl.usedLimit) {
        cancel('UL', transactionDetail);
      }
    }
  }, [loginData, transactionDetail, cancel]);

  // if (!isActive) {
  //   return (
  //     <>
  //       <Header />
  //       <SeparatorLine />
  //       <div className="h-between-b2b"></div>
  //       <Modal
  //         text="Your session has expired"
  //         isLoading={updTrxMut.isLoading}
  //         cb={() => cancel('E', transactionDetail)}
  //       />
  //       <Footer />
  //     </>
  //   );
  // }

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
              {mfaMethod === 'MA' ? null : (
                <>
                  <div className="-mx-[15px] mb-[15px] flex flex-col md:flex-row">
                    <label className="mb-[5px] w-full text-[#212529] font-bold text-sm md:w-1/3">
                      TAC :
                    </label>
                    <div className="flex after:clear-both md:w-2/3">
                      <div className="flex gap-10 md:flex-none !flex-nowrap w-2/3 ">
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
                        <div>
                          {mfaMethod === 'MO' ? (
                            <TACButton
                              disabled={moClicked}
                              requestButtonText={requestButtonText}
                              onClick={handleMORequest}
                            />
                          ) : (
                            <TACButton
                              disabled={false}
                              requestButtonText={requestButtonText}
                              onClick={handleSMSRequest}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="flex w-full justify-center">
                    iSecure Device OTP has been sent to your iRakyat for
                    approval.
                  </p>
                </>
              )}

              <>
                {/* <div className="-mx-[15px] mb-[15px] flex flex-col md:flex-row bg-[rgba(226,135,67,0.6)] text-sm">
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
                </div> */}

                <div className="-mx-[15px] mb-[15px] mt-3 flex flex-col md:flex-row text-sm">
                  <div className=" pl-[2.5em]">
                    {mfa?.validity && (
                      <CountdownText
                        count={10}
                        isNote={true}
                        controller={abortController}
                        cb={() => {
                          checkTxnStatusMut.mutate({
                            accessToken,
                            channel,
                            page: '/payment-detail',
                            refNo: transactionDetail?.recipientReference!,
                            txnID: transactionDetail?.tnxId!,
                          });
                        }}
                        setTimerOff={
                          mfaMethod === 'MA' ? setTimerOff : undefined
                        }
                      />
                    )}
                  </div>
                </div>
              </>
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
              {mfaMethod === 'MA' ? (
                <input
                  type="submit"
                  name="tac"
                  className="bg-[#f26f21] disabled:opacity-50 cursor-pointer text-white py-[5px] px-[25px] w-full min-[480px]:w-auto border-none !rounded-md  flex justify-center items-center"
                  value="Request TAC"
                  disabled={
                    isClicked ||
                    updTrxMut.isLoading ||
                    maSubmit.count >= maSubmit.limit
                  }
                  id="tac"
                />
              ) : (
                <input
                  type="submit"
                  name="doSubmit"
                  className="bg-[#f26f21] disabled:opacity-50 cursor-pointer text-white py-[5px] px-[25px] w-full min-[480px]:w-auto border-none !rounded-md  flex justify-center items-center"
                  value="Proceed"
                  disabled={isClicked || updTrxMut.isLoading || otp.length < 6}
                  id="doSubmit"
                />
              )}
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}

function TACButton({
  requestButtonText,
  onClick,
  disabled,
}: {
  requestButtonText: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      disabled={disabled}
      type="button"
      className="disabled:cursor-not-allowed disabled:opacity-50 px-2 py-1 rounded border border-black"
      onClick={onClick}
    >
      {requestButtonText}
    </button>
  );
}
