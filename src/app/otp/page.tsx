'use client';
import Steps from '@/components/Steps';
import Link from 'next/link';
import React from 'react';

export default function Otp() {
  const requestTac = () => {};
  return (
    <div className="xl:max-w-[1140px] w-full sm:max-w-[540px] md:max-w-[720px] lg:[960px] mx-auto padx75 md:px-0">
      <Steps title="Payment Details" step={2} />
      <form
        // action="paymentDetails3-Success.html"
        // method="post"
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
            <div className="-mx-[15px] mb-[15px] flex flex-col md:flex-row">
              <label className="mb-[5px] text-[#212529] font-bold text-sm md:w-1/3">
                From Account :
              </label>
              <div className="w-full md:w-2/3">
                <div id="accountSummary">
                  <div className="flex w-full flex-wrap ">
                    <div className="w-full md:w-2/3">
                      <select
                        name="fromAcc"
                        id="fromAccDisabled"
                        className="select-bg cursor-not-allowed bg-[#e9ecef] disabled:opacity-[1] !h-[34px] !py-1.5 !px-3 !text-sm"
                        disabled
                      >
                        <option defaultValue=""></option>
                      </select>
                      <input
                        type="hidden"
                        name="fromAcc"
                        id="fromAcc"
                        value=""
                      />
                    </div>
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
                  <div className="md:w-2/3"></div>
                </div>
              </div>
            </div>
            <div className="-mx-[15px] mb-[15px] flex flex-col md:flex-row">
              <label className="mb-[5px] text-[#212529] font-bold text-sm md:w-1/3">
                Pay To :
              </label>
              <div className="flex after:clear-both md:w-2/3">
                <div className="flex flex-wrap">
                  <div className="md:w-2/3"></div>
                </div>
              </div>
            </div>
            <div className="-mx-[15px] mb-[15px] flex flex-col md:flex-row">
              <label className="mb-[5px] text-[#212529] font-bold text-sm md:w-1/3">
                OBW Message ID :
              </label>
              <div className="flex after:clear-both md:w-2/3">
                <div className="flex flex-wrap">
                  <div className="md:w-2/3"></div>
                </div>
              </div>
            </div>
            <div className="-mx-[15px] mb-[15px] flex flex-col md:flex-row">
              <label className="mb-[5px] text-[#212529] font-bold text-sm md:w-1/3">
                Invoice No :
              </label>
              <div className="flex after:clear-both md:w-2/3">
                <div className="flex flex-wrap">
                  <div className="md:w-2/3"></div>
                </div>
              </div>
            </div>
            <div className="-mx-[15px] mb-[15px] flex flex-col md:flex-row">
              <label className="mb-[5px] text-[#212529] font-bold text-sm md:w-1/3">
                Transaction Amount :
              </label>
              <div className="flex after:clear-both md:w-2/3">
                <div className="flex flex-wrap">
                  <div className="md:w-2/3"></div>
                </div>
              </div>
            </div>
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
                  <div className="w-2/5 md:w-1/2 flex justify-end">
                    <button
                      type="button"
                      onClick={requestTac}
                      id="requestTacBtn"
                      name="requestTacBtn"
                      className="text-[#333] leading-[1.2] inline-block bg-white border-[#ccc] cursor-pointer text-center align-middle select-none border border-solid py-1.5 px-3 text-base rounded"
                    >
                      Request TAC
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
              className="bg-[#f26f21] text-white py-[5px] px-[25px] border-none !rounded-md  flex justify-center items-center"
              value="Proceed"
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
