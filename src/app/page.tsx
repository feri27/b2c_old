'use client';

import { sellerDataAtom } from '@/atoms';
import {
  getTransactionNumber,
  postTransactionNumber,
} from '@/services/transaction';
import { generateEightDigitNum, getDate } from '@/utils/helpers';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useLayoutEffect, useState } from 'react';

type InputState = {
  value: string;
  error: string | null;
};

type SrcOfFundInputState = {
  values: Set<string>;
  error: string | null;
};

type Inputs = {
  amount: InputState;
  merchantAccountType: InputState;
  customerName: InputState;
  paymentDescription: InputState;
  merchantName: InputState;
  productID: InputState;
  recipientReference: InputState;
  sourceOfFund: SrcOfFundInputState;
};
const defaultInputState = { error: null, value: '' };
const defaultSrcOfFundInputState = { error: null, values: new Set<string>() };
const defaultInputs: Inputs = {
  customerName: defaultInputState,
  merchantAccountType: defaultInputState,
  merchantName: defaultInputState,
  paymentDescription: defaultInputState,
  productID: defaultInputState,
  sourceOfFund: defaultSrcOfFundInputState,
  recipientReference: defaultInputState,
  amount: defaultInputState,
};

function ErrorText({ text }: { text: String | null }) {
  return <p className="text-red-400 text-xs">{text}</p>;
}

export default function Home() {
  const router = useRouter();
  const [inputs, setInputs] = useState<Inputs>(defaultInputs);
  const setSellerData = useSetAtom(sellerDataAtom);
  const merchantId = 'M00088';
  const date = getDate();

  const txnNumQry = useQuery({
    queryKey: ['txn_num'],
    queryFn: getTransactionNumber,
    refetchOnMount: false,
  });

  const txnNumMut = useMutation({
    mutationFn: postTransactionNumber,
    onSuccess: (data) => {
      const endToEndIDSignature = btoa(endToEndId);
      //?DbtrAgt=${dbtrAgt}&EndtoEndId=${endToEndID}&EndtoEndIdSignature=${endToEndIDSignature}
      setSellerData({
        dbtrAgt,
        endToEndId,
      });
      router.push(`/login`);
    },
  });

  const trxId = date + merchantId + '861' + (txnNumQry.data?.txn_num ?? '');
  const messageId =
    date + merchantId + '861RB' + (txnNumQry.data?.txn_num ?? '');
  const endToEndId =
    date + merchantId + '861RB' + (txnNumQry.data?.txn_num ?? '');
  const dbtrAgt = 'BKRM0602';
  const handleSubmit = () => {
    const emptyFields = Object.entries(inputs)
      .filter((input) => {
        if (input[0] === 'sourceOfFund') {
          const ipt = input[1] as SrcOfFundInputState;
          return !ipt.values || ipt.values.size === 0;
        } else {
          const ipt = input[1] as InputState;
          return !ipt.value || ipt.value.trim().length === 0;
        }
      })
      .map((input) => {
        if (input[0] === 'merchantAccountType') {
          input[1].error = 'please select a value';
        } else if (input[0] === 'sourceOfFund') {
          input[1].error = 'please choose at least one';
        } else {
          input[1].error = 'please enter a value';
        }
        return input;
      });

    if (emptyFields.length) {
      const errObj: Record<string, any> = {};
      emptyFields.forEach((field) => {
        errObj[field[0]] = field[1];
      });
      setInputs((prev) => ({ ...prev, ...errObj }));
    } else {
      const txnNum = trxId.slice(-8);
      const txnStr = trxId.slice(0, -8);
      const tnxNumPlus1 = +txnNum + 1;
      const newTxnID = txnStr + tnxNumPlus1.toString().padStart(8, '0');
      txnNumMut.mutate(newTxnID);
    }
  };

  const handleCheckBox = (e: ChangeEvent<HTMLInputElement>) => {
    const set = inputs.sourceOfFund.values;
    if (set.has(e.target.value)) {
      set.delete(e.target.value);
      setInputs((prev) => ({
        ...prev,
        sourceOfFund: { values: set, error: null },
      }));
    } else {
      set.add(e.target.value);
      setInputs((prev) => ({
        ...prev,
        sourceOfFund: { values: set, error: null },
      }));
    }
  };

  const thClassName = 'py-1.5 px-[0.3rem] text-start';
  return (
    <div className="xl:max-w-[1140px] mx-auto ">
      <div className="block mx-auto md:w-1/2 padx text-[#212529]">
        <div>
          <div className="overflow-x-auto">
            <table className="table table-striped">
              <thead className="align-bottom bg-[#dee1e6] table-header-group">
                <tr>
                  <td scope="col" colSpan={2} className={thClassName}>
                    Transaction Selection
                  </td>
                </tr>
              </thead>
              <tbody className="[&>*:nth-child(odd)]:bg-[var(--bs-table-striped-bg)] ">
                <tr className="table-row ">
                  <th scope="row" className={thClassName}>
                    Merchant ID
                  </th>
                  <td className={thClassName}>
                    <input
                      id="merchantID"
                      type="text"
                      name="merchantID"
                      defaultValue={merchantId}
                      readOnly
                      className="table-input outline-none"
                    />
                  </td>
                </tr>
                <tr>
                  <th scope="row" className={thClassName}>
                    Transaction ID
                  </th>
                  <td className={thClassName}>
                    <input
                      id="transactionID"
                      type="text"
                      className="table-input outline-none"
                      name="transactionID"
                      defaultValue={trxId}
                      readOnly
                    />
                  </td>
                </tr>
                <tr>
                  <th scope="row" className={thClassName}>
                    Message ID
                  </th>
                  <td className={thClassName}>
                    <input
                      id="messageID"
                      type="text"
                      className="table-input outline-none"
                      name="messageID"
                      defaultValue={messageId}
                      readOnly
                    />
                  </td>
                </tr>
                <tr>
                  <th scope="row" className={thClassName}>
                    End to End ID
                  </th>
                  <td className={thClassName}>
                    <input
                      id="endToEndID"
                      type="text"
                      className="table-input outline-none"
                      name="endToEndID"
                      defaultValue={endToEndId}
                      readOnly
                    />
                  </td>
                </tr>
                <tr>
                  <th scope="row" className={thClassName}>
                    Debitor Agent
                  </th>
                  <td className={thClassName}>
                    <input
                      id="dbtrAgt"
                      type="text"
                      className="table-input outline-none"
                      name="dbtrAgt"
                      defaultValue={dbtrAgt}
                      readOnly
                    />
                  </td>
                </tr>
                <tr>
                  <th scope="row" className={thClassName}>
                    Merchant Account Type
                  </th>
                  <td className={thClassName}>
                    <select
                      onChange={(e) =>
                        setInputs((val) => ({
                          ...val,
                          merchantAccountType: {
                            error: null,
                            value: e.target.value,
                          },
                        }))
                      }
                      className="select-bg !bg-white  !h-[26px] !py-0.5 !px-2.5 !outline-[#dee1e6]"
                    >
                      <option value=""></option>
                      <option value="SVGS">Saving Account</option>
                      <option value="CACC">Current Account</option>
                      <option value="CCRD">Credit Card</option>
                      <option value="WALL">e-Wallet</option>
                    </select>
                    <ErrorText text={inputs.merchantAccountType.error} />
                  </td>
                </tr>
                <tr>
                  <th colSpan={2} className={`${thClassName}  pb-[25px]`}></th>
                </tr>
              </tbody>
              <thead className="align-bottom bg-[#dee1e6] table-header-group">
                <tr>
                  <td scope="col" colSpan={2} className={thClassName}>
                    Transaction Details
                  </td>
                </tr>
              </thead>
              <tbody className="[&>*:nth-child(odd)]:bg-[var(--bs-table-striped-bg)]">
                <tr>
                  <th scope="row" className={thClassName}>
                    Customer Name
                  </th>
                  <td className={thClassName}>
                    <input
                      id="customerName"
                      type="text"
                      className="table-input outline-none"
                      name="customerName"
                      value={inputs.customerName.value}
                      onChange={(e) => {
                        setInputs((val) => ({
                          ...val,
                          customerName: { error: null, value: e.target.value },
                        }));
                      }}
                    />
                    <ErrorText text={inputs.customerName.error} />
                  </td>
                </tr>
                <tr>
                  <th scope="row" className={thClassName}>
                    Payment Description
                  </th>
                  <td className={thClassName}>
                    <input
                      id="paymentDescription"
                      type="text"
                      className="table-input outline-none"
                      name="paymentDescription"
                      value={inputs.paymentDescription.value}
                      onChange={(e) => {
                        setInputs((val) => ({
                          ...val,
                          paymentDescription: {
                            error: null,
                            value: e.target.value,
                          },
                        }));
                      }}
                    />
                    <ErrorText text={inputs.paymentDescription.error} />
                  </td>
                </tr>
                <tr>
                  <th scope="row" className={thClassName}>
                    Merchant Name
                  </th>
                  <td className={thClassName}>
                    <input
                      id="merchantName"
                      type="text"
                      className="table-input outline-none"
                      name="merchantName"
                      value={inputs.merchantName.value}
                      onChange={(e) => {
                        setInputs((val) => ({
                          ...val,
                          merchantName: { error: null, value: e.target.value },
                        }));
                      }}
                    />
                    <ErrorText text={inputs.merchantName.error} />
                  </td>
                </tr>
                <tr>
                  <th scope="row" className={thClassName}>
                    Amount
                  </th>
                  <td className={thClassName}>
                    <input
                      id="amount"
                      type="text"
                      className="table-input outline-none"
                      name="amount"
                      value={inputs.amount.value}
                      onChange={(e) => {
                        setInputs((val) => ({
                          ...val,
                          amount: { error: null, value: e.target.value },
                        }));
                      }}
                    />
                    <ErrorText text={inputs.amount.error} />
                  </td>
                </tr>
                <tr>
                  <th scope="row" className={thClassName}>
                    Product ID
                  </th>
                  <td className={thClassName}>
                    <input
                      id="productID"
                      type="text"
                      className="table-input outline-none"
                      name="productID"
                      value={inputs.productID.value}
                      onChange={(e) => {
                        setInputs((val) => ({
                          ...val,
                          productID: { error: null, value: e.target.value },
                        }));
                      }}
                    />
                    <ErrorText text={inputs.productID.error} />
                  </td>
                </tr>
                <tr>
                  <th scope="row" className={thClassName}>
                    Recipient Reference
                  </th>
                  <td className={thClassName}>
                    <input
                      id="recipientReference"
                      type="text"
                      className="table-input outline-none"
                      name="recipientReference"
                      value={inputs.recipientReference.value}
                      onChange={(e) => {
                        setInputs((val) => ({
                          ...val,
                          recipientReference: {
                            error: null,
                            value: e.target.value,
                          },
                        }));
                      }}
                    />
                    <ErrorText text={inputs.recipientReference.error} />
                  </td>
                </tr>
                <tr>
                  <th scope="row" className={thClassName}>
                    Source of Fund
                  </th>
                  <td className={thClassName}>
                    <div className="space-x-1 align-bottom">
                      <input
                        className="scale-[1.2]"
                        type="checkbox"
                        id="casa"
                        value="CASA"
                        onChange={handleCheckBox}
                      />
                      <label
                        className="inline-block  pl-[0.15rem] hover:cursor-pointer"
                        htmlFor="casa"
                      >
                        01 - CASA
                      </label>
                    </div>
                    <div className="space-x-1 ">
                      <input
                        className="scale-[1.2]"
                        type="checkbox"
                        id="creditCard"
                        value="Credit Card"
                        onChange={handleCheckBox}
                      />
                      <label
                        className="inline-block pl-[0.15rem] hover:cursor-pointer"
                        htmlFor="creditCard"
                      >
                        02 - Credit Card
                      </label>
                    </div>
                    <div className="space-x-1">
                      <input
                        className="scale-[1.2]"
                        type="checkbox"
                        id="eWallet"
                        value="eWallet"
                        onChange={handleCheckBox}
                      />
                      <label
                        className="inline-block pl-[0.15rem] hover:cursor-pointer"
                        htmlFor="eWallet"
                      >
                        03 - eWallet
                      </label>
                    </div>
                    <ErrorText text={inputs.sourceOfFund.error} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <input
            type="button"
            className="cursor-pointer py-1 px-3  block mx-auto w-4/6 sm:w-auto min-w-[20%] bg-[#0d6efd] rounded text-white"
            value="Pay"
            onClick={handleSubmit}
          />
          <p className="text-[0.7rem] text-center">Version 1.10</p>
        </div>
      </div>
    </div>
  );
}
