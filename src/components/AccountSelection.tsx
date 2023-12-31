import { TransactionDetail } from '@/services/common/transaction';
import { formatCurrency } from '@/utils/helpers';
import { SetStateAction } from 'jotai';
import { Dispatch } from 'react';

export default function AccountSelection({
  data,
  clicked,
  accType,
  setAccType,
  accountTypeList,
  currentDate,
}: {
  data?: TransactionDetail | null;
  clicked: boolean;
  accType: string;
  setAccType: Dispatch<SetStateAction<string>>;
  accountTypeList:
    | Array<{
        accNo: string;
        accName: string;
        amount: string;
        accType: 'CA' | 'SA' | 'CC';
      }>
    | undefined;
  currentDate: string;
}) {
  return (
    <>
      <div className="-mx-[15px] mb-[15px] flex flex-col md:flex-row text-sm">
        <label
          htmlFor="fromAccDisabled"
          className="mb-[5px] text-[#212529] font-bold text-sm md:w-1/3"
        >
          From Account :
        </label>
        <div className="w-full md:w-2/3">
          <div id="accountSummary">
            <div className="flex w-full flex-wrap ">
              <div className="w-full md:w-2/3">
                <select
                  name="fromAcc"
                  id="fromAccDisabled"
                  disabled={clicked}
                  value={accType}
                  onChange={(e) => setAccType(e.target.value)}
                  className="select-bg disabled:cursor-not-allowed bg-[#e9ecef] disabled:opacity-30 !h-[34px] !py-1.5 !px-3 !text-sm"
                >
                  {accountTypeList?.map((acc) => (
                    <option key={acc.accType} value={acc.accType}>
                      {acc.accName} {acc.accNo} MYR {acc.amount}
                    </option>
                  ))}
                </select>
                <input type="hidden" name="fromAcc" id="fromAcc" value="" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="-mx-[15px] mb-[15px] flex flex-col md:flex-row text-sm">
        <label className="mb-[5px] text-[#212529] font-bold  md:w-1/3">
          Date &amp; Time :
        </label>
        <div className="flex after:clear-both md:w-2/3">
          <div className="flex flex-wrap">
            <p className="">{currentDate}</p>
          </div>
        </div>
      </div>
      <div className="-mx-[15px] mb-[15px] flex flex-col md:flex-row text-sm">
        <label className="mb-[5px] text-[#212529] font-bold  md:w-1/3">
          Pay To :
        </label>
        <div className="flex after:clear-both md:w-2/3">
          <div className="flex flex-wrap">
            <p className="">{data?.creditorName}</p>
          </div>
        </div>
      </div>
      <div className="-mx-[15px] mb-[15px] flex flex-col md:flex-row text-sm">
        <label className="mb-[5px] text-[#212529] font-bold  md:w-1/3">
          OBW Message ID :
        </label>
        <div className="flex after:clear-both md:w-2/3">
          <div className="flex flex-wrap">
            <p className="">{data?.msgId}</p>
          </div>
        </div>
      </div>
      <div className="-mx-[15px] mb-[15px] flex flex-col md:flex-row text-sm">
        <label className="mb-[5px] text-[#212529] font-bold  md:w-1/3">
          Invoice No :
        </label>
        <div className="flex after:clear-both md:w-2/3">
          <div className="flex flex-wrap">
            <p className="">{data?.recipientReference}</p>
          </div>
        </div>
      </div>
      <div className="-mx-[15px] mb-[15px] flex flex-col md:flex-row text-sm">
        <label className="mb-[5px] text-[#212529] font-bold  md:w-1/3">
          Transaction Amount :
        </label>
        <div className="flex after:clear-both md:w-2/3">
          <div className="flex flex-wrap">
            <p className="">MYR {formatCurrency(Number(data?.amount))}</p>
          </div>
        </div>
      </div>
    </>
  );
}
