'use client';
import { corporateLogonIDAtom, loginBDataAtom, userIDAtom } from '@/atoms';
import Layout from '@/components/b2b/Layout';
import Modal from '@/components/common/Modal';
import { useAccessTokenAndChannel } from '@/hooks/useAccessTokenAndChannel';
import { useCancelTransaction } from '@/hooks/useCancelTransaction';
import { useIsSessionActive } from '@/hooks/useIsSessionActive';
import { useLoginBData } from '@/hooks/useLoginBData';
import { useTransactionDetail } from '@/hooks/useTransactionDetail';
import { FromAccount } from '@/services/b2b/auth';
import { createTxn } from '@/services/b2b/transaction';
import { useMutation } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
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
  const [accessToken, channel] = useAccessTokenAndChannel();
  const [isActive, setIsActive] = useState<boolean>(true);

  const { cancel, updTrxMut } = useCancelTransaction({
    page: '/b2b/payment-initiate',
    navigateTo: '/b2b/payment-fail',
  });

  useIsSessionActive(setIsActive);

  const createTxnMut = useMutation({
    mutationFn: createTxn,
    onSuccess: (data) => {
      router.push('/b2b/payment-details');
    },
  });

  useEffect(() => {
    setSelectedAccount(loginBData?.fromAccountList[0]);
  }, [loginBData?.fromAccountList[0]]);

  if (
    transactionDetail &&
    loginBData &&
    transactionDetail.amount > loginBData.trxLimit - loginBData.usedLimit
  ) {
    cancel('UL', transactionDetail);
  }

  const validateForm = () => {
    return selectedAccount === undefined;
  };

  const handleSubmit = () => {
    createTxnMut.mutate({
      accessToken,
      channel,
      corporateLogonID,
      userID,
      exchangeID: 'EX00000001',
      fpxTrxID: transactionDetail?.tnxId ?? '',
      fpxTrxType: 'B2B1',
      fromAccHolder: selectedAccount?.fromAccHolder ?? '',
      fromAccNo: selectedAccount?.fromAccNo ?? '',
      fromAccType: selectedAccount?.fromAccType ?? '',
      otherPmtDetails: transactionDetail?.recipientReference ?? '',
      referenceNo: transactionDetail?.recipientReference ?? '',
      sellerName: transactionDetail?.merchantName ?? '',
      sellerOrdNo: transactionDetail?.recipientReference ?? '',
      totalAmount: transactionDetail?.amount ?? 0.0,
      trxAmount: transactionDetail?.amount ?? 0.0,
      trxCharge: 0.0,
      trxStatus: 'C',
      trxTimestamp: transactionDetail?.currentDT ?? '',
    });
  };

  if (!isActive) {
    return (
      <Layout>
        <div className="h-between-b2b"></div>
        <Modal
          text="Your session has expired"
          isLoading={updTrxMut.isLoading}
          cb={() => cancel('E', transactionDetail)}
        />
      </Layout>
    );
  }

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
                    value={selectedAccount?.fromAccName}
                    disabled={createTxnMut.isLoading || updTrxMut.isLoading}
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
                        {account.fromAccName}
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
                    value={selectedAccount?.fromAccAmount}
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
                    defaultValue={transactionDetail?.merchantName}
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
                    defaultValue={transactionDetail?.endToEndId}
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
                    defaultValue={transactionDetail?.recipientReference}
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
                    defaultValue={transactionDetail?.amount}
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
              onClick={() => cancel('U', transactionDetail)}
              disabled={createTxnMut.isLoading || updTrxMut.isLoading}
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
              disabled={
                validateForm() || createTxnMut.isLoading || updTrxMut.isLoading
              }
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
