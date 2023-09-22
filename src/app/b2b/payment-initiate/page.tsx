'use client';
import {
  cancelTypeAtom,
  corporateLogonIDAtom,
  loginBDataAtom,
  userIDAtom,
} from '@/atoms';
import Layout from '@/components/b2b/Layout';
import Modal from '@/components/common/Modal';
import { useAccessTokenAndChannel } from '@/hooks/useAccessTokenAndChannel';
import { useCancelTransaction } from '@/hooks/useCancelTransaction';
import { useCheckMaintenaceTime } from '@/hooks/useCheckMaintenaceTime';
import { useIsSessionActive } from '@/hooks/useIsSessionActive';
import { useLatAndLong } from '@/hooks/useLatAndLong';
import { useLoginBData } from '@/hooks/useLoginBData';
import { useMerchantData } from '@/hooks/useMerchantData';
import { useTransactionDetail } from '@/hooks/useTransactionDetail';
import { useUpdateTxnMutation } from '@/hooks/useUpdateTxnMutation';
import { FromAccount } from '@/services/b2b/auth';
import { createTxn } from '@/services/b2b/transaction';
import {
  checkSystemLogout,
  formatCurrency,
  mapDbtrAcctTp,
} from '@/utils/helpers';
import { useMutation } from '@tanstack/react-query';
import { useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PaymentInitiate() {
  const router = useRouter();
  const loginBData = useLoginBData();
  const [selectedAccount, setSelectedAccount] = useState<
    FromAccount | undefined
  >();
  const corporateLogonID = useAtomValue(corporateLogonIDAtom);
  const userID = useAtomValue(userIDAtom);
  const transactionDetail = useTransactionDetail();
  const merchantData = useMerchantData();
  const [accessToken, channel] = useAccessTokenAndChannel();
  const setCancelType = useSetAtom(cancelTypeAtom);
  const [isClicked, setIsClicked] = useState(false);
  const latLong = useLatAndLong();
  const { cancel, updTrxMut } = useCancelTransaction({
    page: '/b2b/payment-initiate',
    navigateTo: '/b2b/payment-fail',
    channel: 'B2B',
  });
  const updateTxn = useUpdateTxnMutation(false, '', 'B2B');
  useIsSessionActive(() => {
    setCancelType('EXP');
    cancel('E', transactionDetail);
  });
  useCheckMaintenaceTime('B2B');

  const createTxnMut = useMutation({
    mutationFn: createTxn,
    onSuccess: (data) => {
      if ('message' in data) {
        checkSystemLogout(data.message as string, router, () => {
          if (transactionDetail) {
            updateTxn.mutate({
              endToEndId: transactionDetail.endToEndId,
              dbtrAgt: transactionDetail.dbtrAgt,
              gpsCoord: '-',
              merchantId: transactionDetail.merchantID,
              page: '/b2b/payment-initiate',
              reason: 'FLD',
              sessionID: undefined,
              channel: channel!,
              amount: transactionDetail.amount.toString(),
              payerName: transactionDetail.payerName,
              cdtrAgtBIC: transactionDetail.cdtrAgtBIC,
              dbtrAgtBIC: transactionDetail.dbtrAgtBIC,
            });
          }
        });
      } else {
        if (data.data.header.status === 0) {
          setCancelType('FLD');
          cancel('FLD', transactionDetail);
          return;
        }
        router.push('/b2b/payment-details');
      }
    },
    onError: () => {
      setIsClicked(false);
    },
  });

  useEffect(() => {
    const srcOfFunds = transactionDetail?.sourceOfFunds.split(',');
    const accounts = loginBData?.fromAccountList;
    let availableAccounts: Array<FromAccount> = [];
    if (accounts && srcOfFunds) {
      accounts.forEach((account) => {
        const type = account.fromAccType;
        const typeToNumStr =
          type === 'CA' || type === 'SA' ? '01' : type === 'CC' ? '02' : '03';
        if (srcOfFunds.includes(typeToNumStr)) {
          availableAccounts.push(account);
        }
      });
      if (availableAccounts.length === 0) {
        setCancelType('SOF');
        cancel('C', transactionDetail);
      } else {
        setSelectedAccount(availableAccounts[0]);
      }
    }
  }, [loginBData?.fromAccountList[0].fromAccHolder]);

  useEffect(() => {
    if (selectedAccount) {
      sessionStorage.setItem(
        'selectedAccount',
        JSON.stringify(selectedAccount)
      );
    }
  }, [selectedAccount?.fromAccHolder]);

  const validateForm = () => {
    return selectedAccount === undefined;
  };

  const handleSubmit = () => {
    if (transactionDetail && selectedAccount) {
      const notifyBAccessToken = sessionStorage.getItem('notifyBAccessToken');
      createTxnMut.mutate({
        accessToken: notifyBAccessToken ?? '',
        channel,
        corporateLogonID,
        userID,
        exchangeID: '',
        fpxTrxID: merchantData.endToEndId,
        fpxTrxType: 'B2B1',
        fromAccHolder: selectedAccount.fromAccHolder,
        fromAccNo: selectedAccount.fromAccNo,
        fromAccType: selectedAccount.fromAccType,
        otherPmtDetails: transactionDetail.recipientReference,
        referenceNo: transactionDetail.tnxId,
        sellerName: transactionDetail.creditorName,
        sellerOrdNo: transactionDetail.recipientReference,
        totalAmount: transactionDetail.amount,
        trxAmount: transactionDetail.amount,
        trxCharge: 0.0,
        trxStatus: 'C',
        trxTimestamp: transactionDetail?.currentDT,
        dbtrAgt: transactionDetail.dbtrAgt,
        endToEndId: transactionDetail.endToEndId,
        xpryDt: transactionDetail.xpryDt,
        productId: transactionDetail.productId,
        latlong: latLong,
        bizSvc: transactionDetail.bizSvc,
        cdtrAcctId: transactionDetail.cdtrAcctId,
        cdtrAcctTp: transactionDetail.cdtrAcctTp,
        cdtrAgtBIC: transactionDetail.cdtrAgtBIC,
        dbtrAcctId: selectedAccount.fromAccNo,
        dbtrAcctTp: mapDbtrAcctTp(selectedAccount.fromAccType),
        dbtrAgtBIC: transactionDetail.dbtrAgtBIC,
        dbtrNm: transactionDetail.payerName,
        frBIC: transactionDetail.frBIC,
        toBIC: transactionDetail.toBIC,
      });

      setIsClicked(true);
    }
  };

  // if (!isActive) {
  //   return (
  //     <Layout>
  //       <div className="h-between-b2b"></div>
  //       <Modal
  //         text="Your session has expired"
  //         isLoading={updTrxMut.isLoading}
  //         cb={() => cancel('E', transactionDetail)}
  //       />
  //     </Layout>
  //   );
  // }
  if (!selectedAccount)
    return (
      <Layout>
        <div className="flex flex-col flex-auto h-between-b2b w-full justify-center items-center">
          Loading...
        </div>
      </Layout>
    );
  return (
    <Layout>
      <div className="block mx-auto !mt-2 min-[576px]:max-w-[540px] max-md:text-sm md:max-w-[720px] min-[992px]:max-w-[890px] min-[1200px]:max-w-[960px] min-[1400px]:max-w-[1060px] min-[1600px]:max-w-[1220px]">
        <div className="py-3 px-5 w-full bg-[#e4e7e9] flex justify-between">
          <p className="font-bold text-lg max-[425px]:text-base">
            FPX Payment Initiate
          </p>
          <p className="font-bold text-lg max-[425px]:text-base">
            (Step 1 of 2)
          </p>
        </div>
        <div className="mb-5 py-[5px] px-10 max-[425px]:py-[15px] max-[425px]:px-5 bg-white shadow-[4px_4px_5px_0_rgba(0,0,0,0.27)] border-[#ddd]">
          <div className="py-[15px] max-[425px]:p-0 px-[30px] block mx-auto w-[75%] text-sm">
            <div className="mb-[15px] -mx-[15px] flex flex-col md:flex-row md:items-center">
              <label className="max-w-full text-sm md:w-[41.7%] mb-[5px] font-bold float-left">
                From Account <span className="text-red-500">*</span>
              </label>
              <div className="flex marginx w-full justify-center">
                <div className="w-full padx md:w-3/4 ">
                  <select
                    className="select-bg disabled:cursor-not-allowed disabled:opacity-30 select-bg-b2b mb-[10px]"
                    value={selectedAccount!.fromAccName}
                    disabled={isClicked || updTrxMut.isLoading}
                    onChange={(e) => {
                      const acc = loginBData?.fromAccountList.find(
                        (account) => account.fromAccName === e.target.value
                      );
                      setSelectedAccount(acc);
                    }}
                  >
                    {loginBData?.fromAccountList.map((account) => (
                      <option
                        key={account.fromAccName}
                        value={account.fromAccName}
                      >
                        {account.fromAccNo}-{account.fromAccHolder}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="mb-[15px] -mx-[15px] flex flex-col md:flex-row md:items-center">
              <label className="max-w-full text-sm md:w-[41.7%] mb-[5px] font-bold float-left">
                Available Balance (MYR) <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap marginx  w-full justify-center">
                <div className="w-full padx md:w-3/4">
                  <input
                    id=""
                    type="text"
                    className="block mb-[10px] w-full outline-none bg-clip-padding appearance-none rounded !h-[30px] !py-1.5 !px-3 !leading-[1.2] bg-[#e9ecef]"
                    value={formatCurrency(
                      Number(selectedAccount?.fromAccAmount)
                    )}
                    readOnly
                  />
                </div>
              </div>
            </div>
            <div className="mb-[15px] -mx-[15px] flex flex-col md:flex-row md:items-center">
              <label className="max-w-full text-sm md:w-[41.7%] mb-[5px] font-bold float-left">
                Pay To <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap marginx  w-full justify-center">
                <div className="w-full padx md:w-3/4">
                  <input
                    id=""
                    type="text"
                    className="block mb-[10px] w-full outline-none bg-clip-padding appearance-none rounded !h-[30px] !py-1.5 !px-3 !leading-[1.2] bg-[#e9ecef]"
                    value={transactionDetail?.creditorName}
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="mb-[15px] -mx-[15px] flex flex-col md:flex-row md:items-center">
              <label className="max-w-full text-sm md:w-[41.7%] mb-[5px] font-bold float-left">
                OBW Message ID <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap marginx  w-full justify-center">
                <div className="w-full padx md:w-3/4">
                  <input
                    id=""
                    type="text"
                    className="block mb-[10px] w-full outline-none bg-clip-padding appearance-none rounded !h-[30px] !py-1.5 !px-3 !leading-[1.2] bg-[#e9ecef]"
                    value={transactionDetail?.msgId}
                    readOnly
                  />
                </div>
              </div>
            </div>
            <div className="mb-[15px] -mx-[15px] flex flex-col md:flex-row md:items-center">
              <label className="max-w-full text-sm md:w-[41.7%] mb-[5px] font-bold float-left">
                Invoice No <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap marginx  w-full justify-center">
                <div className="w-full padx md:w-3/4">
                  <input
                    id=""
                    type="text"
                    className="block mb-[10px] w-full outline-none bg-clip-padding appearance-none rounded !h-[30px] !py-1.5 !px-3 !leading-[1.2] bg-[#e9ecef]"
                    value={transactionDetail?.recipientReference}
                    readOnly
                  />
                </div>
              </div>
            </div>
            <div className="mb-[15px] -mx-[15px] flex flex-col md:flex-row md:items-center">
              <label className="max-w-full text-sm md:w-[41.7%] mb-[5px] font-bold float-left">
                Transaction Amount (MYR) <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap marginx  w-full justify-center">
                <div className="w-full padx md:w-3/4">
                  <input
                    id=""
                    type="text"
                    className="block mb-[10px] w-full outline-none bg-clip-padding appearance-none rounded !h-[30px] !py-1.5 !px-3 !leading-[1.2] bg-[#e9ecef]"
                    value={formatCurrency(transactionDetail?.amount)}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap marginx  w-full justify-center">
        <div className="w-1/3 min-[1300px]:w-[35.333333%] offset-xl-4 offset-lg-4 offset-md-4 offset-sm-4">
          <div className="!mb-2.5 flex justify-center">
            <button
              // href="ibiz_paymentDetails-Fail.html"
              onClick={() => {
                cancel('U', transactionDetail);
                setCancelType('U');
              }}
              disabled={isClicked || updTrxMut.isLoading}
              className="border border-solid disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer text-center border-[#006fb3] py-[5px] px-[25px] leading-[1.2] w-[150px] m-2.5 text-[0.8rem] !rounded-[20px] bg-white"
            >
              Cancel
            </button>
            {/* <input type="submit" name="doSubmit" className="acc-selc-orange-button" value="Next" id="doSubmit" disabled/>  */}
            <input
              type="button"
              name="doSubmit"
              className="border disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer border-solid text-white border-[#006fb3] py-[5px] px-[25px] leading-[1.2] w-[150px] m-2.5 text-[0.8rem] !rounded-[20px] bg-[#006fb3]"
              value="Submit"
              id="doSubmit"
              onClick={handleSubmit}
              disabled={validateForm() || isClicked || updTrxMut.isLoading}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
