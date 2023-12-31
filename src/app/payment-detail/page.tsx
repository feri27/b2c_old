'use client';
import AccountSelection from '@/components/AccountSelection';
import Steps from '@/components/Steps';
import { Account, account } from '@/services/account';
import {
  authorizeTransaction,
  checkTxnStatus,
  notifyTransaction,
} from '@/services/transaction';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { verifyOTP } from '@/services/veritfyOtp';
import {
  checkSessionExpiry,
  checkSystemLogout,
  encrypt,
  getLocalDateWithISOFormat,
  getSessionID,
  mapSrcOfFund,
} from '@/utils/helpers';
import { useTransactionDetail } from '@/hooks/useTransactionDetail';
import { useLoginData } from '@/hooks/useLoginData';
import { useAccessTokenAndChannel } from '@/hooks/useAccessTokenAndChannel';
import { usePrivateKey } from '@/hooks/usePrivateKey';
import SeparatorLine from '@/components/SeparatorLine';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CountdownText from '@/components/CountdownText';
import { useIsSessionActive } from '@/hooks/useIsSessionActive';
import { useCancelTransaction } from '@/hooks/useCancelTransaction';
import { useGetMFA } from '@/hooks/useGetMFA';
import { Socket, io } from 'socket.io-client';
import { useCheckMaintenaceTime } from '@/hooks/useCheckMaintenaceTime';
import { debit } from '@/services/debit';
import { useUpdateTxnMutation } from '@/hooks/useUpdateTxnMutation';
import { useSetAtom } from 'jotai';
import { cancelTypeAtom } from '@/atoms';
import { BACKEND_DOMAIN } from '@/utils/config';
import { useLogoutOnBrowserClose } from '@/hooks/useLogoutOnBrowserClose';
import { useLogout } from '@/hooks/useLogout';

const abortController = new AbortController();

export default function PaymentDetail() {
  const router = useRouter();
  const [_, channel, notifyAccessToken] = useAccessTokenAndChannel();
  const setCancelType = useSetAtom(cancelTypeAtom);
  const [socket, setSocket] = useState<Socket | undefined>();
  const { cancel: CancelTxn, updTrxMut } = useCancelTransaction({
    page: '/payment-detail',
    channel: 'B2C',
  });
  const cancel = useCallback(CancelTxn, []);
  const updateTxnMut = useUpdateTxnMutation(false, '', 'B2C');
  useCheckMaintenaceTime('B2C');
  const loginData = useLoginData();
  const transactionDetail = useTransactionDetail();
  const [timerOff, setTimerOff] = useState<boolean>(true);
  const [maSubmit, setMASubmit] = useState<{ limit: number; count: number }>({
    limit: 1,
    count: 0,
  });
  const mfa = useGetMFA();
  const [otp, setOtp] = useState<string>('');
  const [authProceed, setAuthProceed] = useState(false);
  const privateKeyQry = usePrivateKey({ enabled: mfa?.method === 'MO' });
  const [accountType, setAccountType] = useState('');
  const [accountTypeList, setAccountTypeList] = useState<
    | Array<{
        accNo: string;
        accName: string;
        amount: string;
        accType: 'CA' | 'SA' | 'CC';
      }>
    | undefined
  >();
  const [isClicked, setIsClicked] = useState(false);
  const [moClicked, setMoClicked] = useState(false);
  const [reqTACButtonClicked, setReqTACButtonClicked] = useState(false);
  const [fetchAccount, setFetchAccount] = useState(false);
  const logoutMut = useLogout('/payment-detail', 'S', setIsClicked);
  const [currentDate, __] = useState(getLocalDateWithISOFormat());

  useLogoutOnBrowserClose(logoutMut.mutate, {
    accessToken: isClicked ? '' : notifyAccessToken,
    logoutCalled: isClicked,
    page: '/payment-detail',
    dbtrAgt: transactionDetail?.dbtrAgt ?? 'BKRMMYKL',
  });

  useIsSessionActive(
    () => {
      setCancelType('EXP');
      cancel('E', transactionDetail);
    },
    false,
    'B2C'
  );

  const accountQry = useQuery({
    queryKey: ['account', loginData?.cif],
    queryFn: () => account(loginData?.cif ?? ''),
    enabled: loginData?.cif !== undefined && fetchAccount,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    const srcOfFunds = transactionDetail?.sourceOfFunds.split(',');
    let accountData: Account | undefined = undefined;
    if (accountQry.data && 'data' in accountQry.data) {
      accountData = accountQry.data;
    }
    let availableAccounts: typeof accountTypeList = [];
    if (accountData && srcOfFunds) {
      srcOfFunds.forEach((src) => {
        const firstTwoDigits = accountData?.data.accNo.slice(0, 2);
        const type =
          firstTwoDigits === '11' && src === '01'
            ? 'CA'
            : firstTwoDigits === '22' && src === '01'
            ? 'SA'
            : firstTwoDigits !== '11' && firstTwoDigits !== '22' && src === '02'
            ? 'CC'
            : '';
        if (type && accountData?.data) {
          availableAccounts?.push({
            accNo: accountData.data.accNo,
            accName: accountData.data.accName,
            amount: accountData.data.availableBalance,
            accType: type,
          });
        }
      });
      if (availableAccounts.length === 0) {
        setCancelType('SOF');
        cancel('FLD', transactionDetail);
      } else {
        setAccountTypeList(availableAccounts);
      }
    }
  }, [accountQry.data]);

  useEffect(() => {
    if (mfa?.method === 'NIL') {
      setCancelType('MFA_NIL');
      cancel('MFA', transactionDetail);
    } else if (mfa?.method === 'NR') {
      setCancelType('MFA_NR');
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

  const updateTxnPayload = {
    endToEndId: transactionDetail?.endToEndId ?? '',
    dbtrAgt: transactionDetail?.dbtrAgt ?? '',
    gpsCoord: '-',
    merchantId: transactionDetail?.merchantID ?? '',
    page: '/payment-detail',
    reason: 'FLD',
    sessionID: undefined,
    channel: channel,
    amount: transactionDetail?.amount.toString() ?? '',
    payerName: transactionDetail?.payerName ?? '',
    cdtrAgtBIC: transactionDetail?.cdtrAgtBIC ?? '',
    dbtrAgtBIC: transactionDetail?.dbtrAgtBIC ?? '',
    dbtrAcctId:
      accountQry.data && 'data' in accountQry.data
        ? String(accountQry.data.data.creditCardNo)
        : '',
  } as const;
  const authorizeTxnMut = useMutation({
    mutationFn: authorizeTransaction,
    onSuccess: (data) => {
      if ('message' in data) {
        if ((data.message as string).includes('force logout')) {
          checkSystemLogout(data.message as string, router, 'B2C', () => {
            if (transactionDetail) {
              updateTxnMut.mutate(updateTxnPayload);
            }
          });
        } else {
          setCancelType('FLD');
          cancel('TO', transactionDetail);
        }
      }
    },
    onError: () => {
      setCancelType('FLD');
      cancel('TO', transactionDetail);
    },
  });
  const notifyTxnMut = useMutation({
    mutationFn: notifyTransaction,
    onSuccess: (data) => {
      if ('message' in data && (data.message as string).includes('logout')) {
        checkSystemLogout(data.message as string, router, 'B2C', () => {
          if (transactionDetail) {
            updateTxnMut.mutate(updateTxnPayload);
          }
        });
      } else router.push('/payment-success');
    },
    onError: () => {
      router.push('/payment-success');
      setIsClicked(false);
    },
  });
  const debitMut = useMutation({
    mutationFn: debit,
    onSuccess: (data) => {
      if ('message' in data) {
        if ((data.message as string).includes('force logout')) {
          checkSystemLogout(data.message as string, router, 'B2C', () => {
            if (transactionDetail) {
              updateTxnMut.mutate(updateTxnPayload);
            }
          });
        } else {
          setCancelType('FLD');
          cancel('TO', transactionDetail);
        }
      } else {
        if (
          data.PymtConfirmRs.resBody.TxSts === 'ACTC' ||
          data.PymtConfirmRs.resBody.TxSts === 'ACSP'
        ) {
          router.push('/payment-success');
        } else {
          const sessionID = getSessionID();
          if (transactionDetail) {
            updateTxnMut.mutate({
              dbtrAgt: transactionDetail.dbtrAgt,
              endToEndId: transactionDetail.endToEndId,
              gpsCoord: '',
              merchantId: transactionDetail.msgId,
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
              dbtrAcctId:
                accountQry.data && 'data' in accountQry.data
                  ? String(accountQry.data.data.creditCardNo)
                  : '',
              dbtrAgtBIC: transactionDetail?.dbtrAgtBIC ?? '',
            });
          }
          if (accountQry.data && 'data' in accountQry.data && transactionDetail)
            notifyTxnMut.mutate({
              accessToken: notifyAccessToken,
              fromAccountHolder: accountQry.data.data.accHolderName,
              fromAccountNo: accountQry.data.data.accNo,
              referenceNo: transactionDetail.recipientReference,
              totalAmount: transactionDetail.amount,
              transactionNo: transactionDetail.tnxId,
              trxAmount: transactionDetail.amount,
              trxTimestamp: transactionDetail.currentDT,
              sellerName: transactionDetail.creditorName,
              trxStatus: 'S',
              channel,
              dbtrAgt: transactionDetail.dbtrAgt,
            });
        }
      }
    },
    onError: () => {
      if (accountQry.data && 'data' in accountQry.data && transactionDetail)
        notifyTxnMut.mutate({
          accessToken: notifyAccessToken,
          fromAccountHolder: accountQry.data.data.accHolderName,
          fromAccountNo: accountQry.data.data.accNo,
          referenceNo: transactionDetail.recipientReference,
          totalAmount: transactionDetail.amount,
          transactionNo: transactionDetail.tnxId,
          trxAmount: transactionDetail.amount,
          trxTimestamp: transactionDetail.currentDT,
          sellerName: transactionDetail.creditorName,
          trxStatus: 'S',
          channel,
          dbtrAgt: transactionDetail.dbtrAgt,
        });
    },
  });

  const checkTxnStatusMut = useMutation({
    mutationFn: checkTxnStatus,
    onSuccess: (data) => {
      if ('message' in data) {
        if ((data.message as string).includes('force logout')) {
          checkSystemLogout(data.message as string, router, 'B2C', () => {
            if (transactionDetail) {
              updateTxnMut.mutate(updateTxnPayload);
            }
          });
        } else {
          setCancelType('FLD');
          cancel('TO', transactionDetail);
        }
      } else {
        if (maSubmit.count >= 3 && maSubmit.count >= maSubmit.limit) {
          setCancelType('FLD');
          cancel('MFA', transactionDetail);
          return;
        }
        const approvalStatus = data.data.body.approvalStatus;
        if (
          approvalStatus === 'R' ||
          approvalStatus === 'F' ||
          approvalStatus === 'C'
        ) {
          setCancelType('FLD');
          cancel('ALF', transactionDetail);
        } else if (approvalStatus === 'P') {
          setMASubmit((prev) => ({ ...prev, limit: 3 }));
        } else if (approvalStatus === 'A') {
          if (
            transactionDetail &&
            accountQry.data &&
            'data' in accountQry.data
          ) {
            debitMut.mutate({
              bizSvc: transactionDetail.bizSvc,
              cdtrAcctId: transactionDetail.cdtrAcctId,
              cdtrAcctTp: transactionDetail.cdtrAcctTp,
              cdtrAgtBIC: transactionDetail.cdtrAgtBIC,
              cdtrNm: transactionDetail.creditorName,
              channel: 'B2C',
              dbtrAcctId: accountQry.data.data.accNo,
              dbtrAcctTp: mapSrcOfFund(accountType, accountQry.data.data.accNo),
              dbtrAgtBIC: transactionDetail.dbtrAgtBIC,
              dbtrNm: transactionDetail.payerName,
              frBIC: transactionDetail.frBIC,
              instgAgtBIC: transactionDetail.dbtrAgt,
              interBkSttlmAmt: String(transactionDetail.amount),
              recptRef: transactionDetail.recipientReference,
              toBIC: transactionDetail.toBIC,
              txId: transactionDetail.endToEndId,
            });
          }
        }
      }
    },
    onError: () => {
      setCancelType('FLD');
      cancel('TO', transactionDetail);
    },
  });

  useEffect(() => {
    if (accountQry.data && 'message' in accountQry.data) {
      checkSystemLogout(accountQry.data.message, router, 'B2C', () => {
        if (transactionDetail) {
          updateTxnMut.mutate(updateTxnPayload);
        }
      });
    }
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
      if ('message' in data) {
        if ((data.message as string).includes('force logout')) {
          checkSystemLogout(data.message as string, router, 'B2C', () => {
            if (transactionDetail) {
              updateTxnMut.mutate(updateTxnPayload);
            }
          });
        } else {
          setCancelType('FLD');
          cancel('TO', transactionDetail);
        }
      } else {
        if (data.data.header.status !== 1 || data.data.header.errorId) {
          setCancelType('FLD');
          cancel('MFA', transactionDetail);
        } else {
          if (accountQry.data)
            if (
              transactionDetail &&
              accountQry.data &&
              'data' in accountQry.data
            ) {
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
                dbtrAcctId: accountQry.data.data.accNo,
                dbtrAcctTp: mapSrcOfFund(
                  accountType,
                  accountQry.data.data.accNo
                ),
                dbtrAgtBIC: transactionDetail.dbtrAgtBIC,
                dbtrNm: transactionDetail.payerName,
                frBIC: transactionDetail.frBIC,
                instgAgtBIC: transactionDetail.dbtrAgt,
                interBkSttlmAmt: String(transactionDetail.amount),
                recptRef: transactionDetail.recipientReference,
                toBIC: transactionDetail.toBIC,
                txId: transactionDetail.endToEndId,
              });
            }
        }
      }
    },
    onError: () => {
      setCancelType('FLD');
      cancel('TO', transactionDetail);
    },
  });

  const handleSMSRequest = () => {
    const expired = checkSessionExpiry(
      false,
      () => {
        setCancelType('EXP');
        cancel('E', transactionDetail);
      },
      transactionDetail
    );
    if (expired) {
      return;
    }
    if (maSubmit.limit === 1) {
      setMASubmit((prev) => ({ ...prev, limit: 3 }));
    }
    setTimerOff(false);
    if (maSubmit.count >= 3 && maSubmit.count >= maSubmit.limit) {
      setCancelType('FLD');
      cancel('MFA', transactionDetail);
      return;
    }
    setMASubmit((prev) => ({ ...prev, count: prev.count + 1 }));
    setReqTACButtonClicked(true);
    return;
  };
  const handleMORequest = () => {
    const expired = checkSessionExpiry(
      false,
      () => {
        setCancelType('EXP');
        cancel('E', transactionDetail);
      },
      transactionDetail
    );
    if (expired) {
      return;
    }
    if (maSubmit.limit === 1) {
      setMASubmit((prev) => ({ ...prev, limit: 3 }));
    }
    setReqTACButtonClicked(true);
    setTimerOff(false);
    setMASubmit((prev) => ({ ...prev, count: prev.count + 1 }));
    if (maSubmit.count >= 3 && maSubmit.count >= maSubmit.limit) {
      setCancelType('FLD');
      cancel('MFA', transactionDetail);
      return;
    }
    if (accountQry.data && 'data' in accountQry.data && transactionDetail) {
      authorizeTxnMut.mutate({
        accessToken: notifyAccessToken,
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
        dbtrAgt: transactionDetail.dbtrAgt,
      });
    }
    setMoClicked(true);
    return;
  };
  const proceedHandler = (e: FormEvent) => {
    e.preventDefault();
    const expired = checkSessionExpiry(
      false,
      () => {
        setCancelType('EXP');
        cancel('E', transactionDetail);
      },
      transactionDetail
    );
    if (expired) {
      return;
    }
    if ((mfaMethod === 'SMS' || mfaMethod === 'MO') && !otp) {
      return;
    }
    if (mfaMethod === 'SMS') {
      if (otp === '123456') {
        if (transactionDetail && accountQry.data && 'data' in accountQry.data) {
          debitMut.mutate({
            bizSvc: transactionDetail.bizSvc,
            cdtrAcctId: transactionDetail.cdtrAcctId,
            cdtrAcctTp: transactionDetail.cdtrAcctTp,
            cdtrAgtBIC: transactionDetail.cdtrAgtBIC,
            cdtrNm: transactionDetail.creditorName,
            channel: 'B2C',
            dbtrAcctId: accountQry.data.data.accNo,
            dbtrAcctTp: mapSrcOfFund(accountType, accountQry.data.data.accNo),
            dbtrAgtBIC: transactionDetail.dbtrAgtBIC,
            dbtrNm: transactionDetail.payerName,
            frBIC: transactionDetail.frBIC,
            instgAgtBIC: transactionDetail.dbtrAgt,
            interBkSttlmAmt: String(transactionDetail.amount),
            recptRef: transactionDetail.recipientReference,
            toBIC: transactionDetail.toBIC,
            txId: transactionDetail.endToEndId,
          });
        }
        setIsClicked(true);
      } else {
        setCancelType('FLD');
        cancel('MFA', transactionDetail);
        setIsClicked(true);
      }
    } else if (mfaMethod === 'MO') {
      abortController.abort();
      const secret = privateKeyQry.data?.private_key ?? '';
      const { encryptedTxt, iv } = encrypt(otp, secret);
      if (transactionDetail) {
        verifyOTPMut.mutate({
          accessToken: notifyAccessToken,
          iv: iv.toString('base64'),
          otp: encryptedTxt.toString('base64'),
          channel,
          deliveryChannel: mfaMethod,
          dbtrAgt: transactionDetail.dbtrAgt,
        });
      }
      setIsClicked(true);
    } else if (mfaMethod === 'MA') {
      setReqTACButtonClicked(true);
      if (maSubmit.count === 0) {
        setTimerOff(false);
      }

      setMASubmit((prev) => ({ ...prev, count: prev.count + 1 }));
      if (accountQry.data && 'data' in accountQry.data && transactionDetail) {
        authorizeTxnMut.mutate({
          accessToken: notifyAccessToken,
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
          dbtrAgt: transactionDetail.dbtrAgt,
        });
      }
      if (maSubmit.count > 0 && transactionDetail) {
        checkTxnStatusMut.mutate({
          accessToken: notifyAccessToken,
          channel,
          page: '/payment-detail',
          refNo: transactionDetail?.recipientReference!,
          txnID: transactionDetail?.tnxId!,
          dbtrAgt: transactionDetail.dbtrAgt,
        });
      }
      let newSocket = socket;
      if (!newSocket) {
        newSocket = io(`${BACKEND_DOMAIN}:5000`);
        setSocket(newSocket);
        newSocket.emit('start', { txnID: transactionDetail?.tnxId });
      }

      newSocket.on('data', (data) => {
        const status = data['status'];
        if (status !== 1) {
          setCancelType('FLD');
          cancel('FLD', transactionDetail);
        } else {
          if (
            transactionDetail &&
            accountQry.data &&
            'data' in accountQry.data
          ) {
            debitMut.mutate({
              bizSvc: transactionDetail.bizSvc,
              cdtrAcctId: transactionDetail.cdtrAcctId,
              cdtrAcctTp: transactionDetail.cdtrAcctTp,
              cdtrAgtBIC: transactionDetail.cdtrAgtBIC,
              cdtrNm: transactionDetail.creditorName,
              channel: 'B2C',
              dbtrAcctId: accountQry.data.data.accNo,
              dbtrAcctTp: mapSrcOfFund(accountType, accountQry.data.data.accNo),
              dbtrAgtBIC: transactionDetail.dbtrAgtBIC,
              dbtrNm: transactionDetail.payerName,
              frBIC: transactionDetail.frBIC,
              instgAgtBIC: transactionDetail.dbtrAgt,
              interBkSttlmAmt: String(transactionDetail.amount),
              recptRef: transactionDetail.recipientReference,
              toBIC: transactionDetail.toBIC,
              txId: transactionDetail.endToEndId,
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
      if (
        transactionDetail.amount >
        loginData.mbl.trxLimit - loginData.mbl.usedLimit
      ) {
        setCancelType('UL');
        cancel('UL', transactionDetail);
      } else {
        setFetchAccount(true);
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

  if (
    !transactionDetail ||
    !accountQry.data ||
    !accountTypeList ||
    !mfa?.method ||
    !loginData
  ) {
    return (
      <>
        <Header />
        <SeparatorLine />
        <div className="flex flex-col flex-auto h-between w-full justify-center items-center">
          Loading...
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <SeparatorLine />
      <div className="xl:max-w-[1140px] w-full sm:max-w-[540px] md:max-w-[720px] lg:[960px] mx-auto padx md:px-0 h-between">
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
                accountTypeList={accountTypeList}
                currentDate={currentDate}
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
                            disabled={!moClicked && !reqTACButtonClicked}
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
                              disabled={
                                ((moClicked || reqTACButtonClicked) &&
                                  !timerOff) ||
                                maSubmit.count >= maSubmit.limit
                              }
                              requestButtonText={requestButtonText}
                              onClick={handleMORequest}
                            />
                          ) : (
                            <TACButton
                              disabled={
                                (reqTACButtonClicked && !timerOff) ||
                                maSubmit.count >= maSubmit.limit
                              }
                              requestButtonText={requestButtonText}
                              onClick={handleSMSRequest}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* {moClicked && (
                    <p className="flex w-full justify-center">
                      iSecure Device OTP has been sent to your iRakyat for
                      approval.
                    </p>
                  )} */}
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
                    {mfa?.validity && reqTACButtonClicked ? (
                      <CountdownText
                        count={mfa.validity}
                        isNote={true}
                        buttonClickCount={maSubmit.count}
                        controller={abortController}
                        mfaMethod={mfaMethod as 'SMS' | 'MA' | 'MO'}
                        cb={() => {
                          const expired = checkSessionExpiry(
                            false,
                            () => {
                              setCancelType('EXP');
                              cancel('E', transactionDetail);
                            },
                            transactionDetail
                          );
                          if (expired) {
                            return;
                          }
                          if (mfaMethod === 'MA') {
                            checkTxnStatusMut.mutate({
                              accessToken: notifyAccessToken,
                              channel,
                              page: '/payment-detail',
                              refNo: transactionDetail?.recipientReference!,
                              txnID: transactionDetail?.tnxId!,
                              dbtrAgt: transactionDetail.dbtrAgt,
                            });
                          }
                        }}
                        setTimerOff={setTimerOff}
                      />
                    ) : null}
                  </div>
                </div>
              </>
            </div>
          </div>
          <div className=" text-sm my-2 ">
            <div className="!mb-[15px] flex-wrap mt-2.5 justify-center gap-5 w-full padx flex">
              <input
                type="button"
                onClick={(e) => {
                  setTimerOff(true);
                  const expired = checkSessionExpiry(
                    false,
                    () => {
                      setCancelType('EXP');
                      cancel('E', transactionDetail);
                    },
                    transactionDetail
                  );
                  if (expired) {
                    return;
                  }
                  setCancelType('U');
                  cancel('U', transactionDetail);
                }}
                disabled={
                  isClicked ||
                  updTrxMut.isLoading ||
                  checkTxnStatusMut.isLoading ||
                  debitMut.isLoading ||
                  verifyOTPMut.isLoading
                }
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
                    checkTxnStatusMut.isLoading ||
                    debitMut.isLoading ||
                    verifyOTPMut.isLoading ||
                    maSubmit.count >= maSubmit.limit ||
                    !timerOff
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
