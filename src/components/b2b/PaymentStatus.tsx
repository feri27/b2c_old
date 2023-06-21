import { TransactionDetail } from '@/services/common/transaction';
import React from 'react';
import Layout from './Layout';

export default function PaymentStatus({
  tnxDetail,
  status,
  cb,
  isLoading,
}: {
  tnxDetail: TransactionDetail | null;
  status: string;
  cb: () => void;
  isLoading: boolean;
}) {
  const print = () => {
    window.print();
  };

  return (
    <>
      <Layout>
        <div className="block mx-auto !mt-2 min-[576px]:max-w-[540px] md:max-w-[720px] min-[992px]:max-w-[890px] min-[1200px]:max-w-[960px] min-[1400px]:max-w-[1060px] min-[1600px]:max-w-[1220px]">
          <div className="py-3 px-5 w-full bg-[#e4e7e9] flex justify-between">
            <p className="font-bold text-lg max-[425px]:text-base">
              FPX Payment Initiate
            </p>
            <p className="font-bold text-lg max-[425px]:text-base">
              (Step 2 of 2)
            </p>
          </div>
          <div className="mb-5 py-[5px] px-10 max-[425px]:py-[15px] max-[425px]:px-5 bg-white shadow-[4px_4px_5px_0_rgba(0,0,0,0.27)] border-[#ddd]">
            <div className="py-[15px] max-[425px]:p-0 px-[30px] block mx-auto w-[75%]">
              <div className="mb-[15px] -mx-[15px] flex flex-col md:flex-row md:items-center">
                <label className="max-w-full text-sm md:w-[41.7%] mb-[5px] font-bold float-left">
                  Transaction Status
                </label>
                <div className="flex marginx w-full justify-center">
                  <div className="w-full max-[768px]:padx text-sm md:w-3/4 ">
                    <p>{status}</p>
                  </div>
                </div>
              </div>
              <div className="mb-[15px] -mx-[15px] flex flex-col md:flex-row md:items-center">
                <label className="max-w-full text-sm md:w-[41.7%] mb-[5px] font-bold float-left">
                  Date & Time
                </label>
                <div className="flex flex-wrap marginx  w-full justify-center">
                  <div className="w-full max-[768px]:padx text-sm md:w-3/4">
                    <p>{tnxDetail?.currentDT}</p>
                  </div>
                </div>
              </div>
              <div className="mb-[15px] -mx-[15px] flex flex-col md:flex-row md:items-center">
                <label className="max-w-full text-sm md:w-[41.7%] mb-[5px] font-bold float-left">
                  Reference Number
                </label>
                <div className="flex flex-wrap marginx  w-full justify-center">
                  <div className="w-full max-[768px]:padx text-sm md:w-3/4">
                    <p>{tnxDetail?.recipientReference}</p>
                  </div>
                </div>
              </div>

              <div className="mb-[15px] -mx-[15px] flex flex-col md:flex-row md:items-center">
                <label className="max-w-full text-sm md:w-[41.7%] mb-[5px] font-bold float-left">
                  Pay To
                </label>
                <div className="flex flex-wrap marginx  w-full justify-center">
                  <div className="w-full max-[768px]:padx text-sm md:w-3/4">
                    <p>{tnxDetail?.merchantName}</p>
                  </div>
                </div>
              </div>
              <div className="mb-[15px] -mx-[15px] flex flex-col md:flex-row md:items-center">
                <label className="max-w-full text-sm md:w-[41.7%] mb-[5px] font-bold float-left">
                  Transation Amount
                </label>
                <div className="flex flex-wrap marginx  w-full justify-center">
                  <div className="w-full max-[768px]:padx text-sm md:w-3/4">
                    <p>{tnxDetail?.amount}</p>
                  </div>
                </div>
              </div>
              <div className="mb-[15px] -mx-[15px] flex flex-col md:flex-row md:items-center">
                <label className="max-w-full text-sm md:w-[41.7%] mb-[5px] font-bold float-left">
                  OBW Message ID
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap marginx  w-full justify-center">
                  <div className="w-full max-[768px]:padx text-sm md:w-3/4">
                    <p>{tnxDetail?.endToEndId}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap marginx  w-full justify-center hide-when-print">
          <div className="w-1/3 min-[1300px]:w-[35.333333%] offset-xl-4 offset-lg-4 offset-md-4 offset-sm-4">
            <div className="!mb-2.5 flex justify-center">
              <button
                onClick={print}
                disabled={isLoading}
                className="disabled:opacity-50 disabled:cursor-not-allowed border border-solid text-center border-[#006fb3] py-[5px] px-[25px] leading-[1.2] w-[150px] m-2.5 text-[0.8rem] !rounded-[20px] bg-white hover:bg-[#006fb3] hover:text-white"
              >
                Print
              </button>
              {/* <input type="submit" name="doSubmit" className="acc-selc-orange-button" value="Next" id="doSubmit" disabled/>  */}
              <input
                type="button"
                name="continue"
                className="disabled:opacity-50 disabled:cursor-not-allowed border border-solid text-white cursor-pointer border-[#006fb3] py-[5px] px-[25px] leading-[1.2] w-[150px] m-2.5 text-[0.8rem] !rounded-[20px] bg-[#006fb3]"
                value="Continue"
                onClick={cb}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </Layout>
      <div className="example-print w-full container-fluids">
        <div className="headerContainer">
          <nav className="navbar navbar-ibiz navbar-expand-lg">
            <div className="navContainer">
              <div className="flex justify-between">
                <div className="col-lg-6 col-md-6 col-sm-6 col-6 mt-auto mb-auto">
                  <img
                    src="/images/fpxlogo.png"
                    className="ibiz-logo img-thumbnail"
                    alt="OBW-logo"
                  />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                  <img
                    src="/images/Bank Rakyat Logo.ai-3_BM (BLACK TAGLINE).png"
                    className="bkr-logo img-thumbnail pull-right"
                  />
                </div>
              </div>
            </div>
          </nav>
        </div>
        <div className="separatorLine"></div>
        <div className="w-[70%] mx-auto mb-2.5">
          <div className="flex justify-between">
            <div className="col-sm-4 col-md-4 col-lg-4 col-5 w-1/2">
              <h3 className="text-4xl text-left">FPX Payment Details</h3>
            </div>
            <div className="printDate text-sm col-sm-8 col-md-8 col-lg-8 col-5 w-1/2 flex justify-center mt-3">
              <p>
                Print Date:{' '}
                <span id="date">
                  {new Date().toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </span>
                &emsp;&emsp;Time:{' '}
                <span id="time">
                  {new Date().getHours() +
                    ':' +
                    new Date().getMinutes() +
                    ':' +
                    new Date().getSeconds()}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-3xl mx-auto">
          <form
            name="completeForm"
            autoComplete="off"
            className="form-horizontal"
            target="_top"
            id="completeForm"
          >
            <div className="panel panel-default mt-7 ">
              <div className="panel-body w-4/5 mx-auto">
                <div className="form-group mb-4 flex w-full space-x-1 ">
                  <label className="text-end font-extrabold w-1/2 ">
                    Status :
                  </label>
                  <div className="paymentLabelAdd col-xl-8 col-lg-8 col-md-8 col-12">
                    Created
                  </div>
                </div>
                <div className="form-group mb-4 flex w-full space-x-1 ">
                  <label className="text-end font-extrabold w-1/2 ">
                    Date &amp; Time :
                  </label>
                  <div className="paymentLabelAdd col-xl-8 col-lg-8 col-md-8 col-12">
                    <p>{tnxDetail?.currentDT}</p>
                  </div>
                </div>
                <div className="form-group mb-4 flex w-full space-x-1 ">
                  <label className="text-end font-extrabold w-1/2 ">
                    Reference Number :
                  </label>
                  <div className="paymentLabelAdd col-xl-8 col-lg-8 col-md-8 col-12">
                    {tnxDetail?.recipientReference}
                  </div>
                </div>
                <div className="form-group mb-4 flex w-full space-x-1 ">
                  <label className="text-end font-extrabold w-1/2 ">
                    Pay To :
                  </label>
                  <div className="paymentLabelAdd col-xl-8 col-lg-8 col-md-8 col-12">
                    {tnxDetail?.merchantName}
                  </div>
                </div>
                <div className="form-group mb-4 flex w-full space-x-1 ">
                  <label className="text-end font-extrabold w-1/2 ">
                    Transaction Amount :
                  </label>
                  <div className="paymentLabelAdd col-xl-8 col-lg-8 col-md-8 col-12">
                    {tnxDetail?.amount}
                  </div>
                </div>
                <div className="form-group mb-4 flex w-full space-x-1">
                  <label className="text-end font-extrabold w-1/2">
                    OBW Message ID :
                  </label>
                  <div className="paymentLabelAdd col-xl-8 col-lg-8 col-md-8 col-12">
                    {tnxDetail?.endToEndId}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="absolute bottom-0 left-0 w-full">
          <div className="row">
            <p>
              Note: This is a computer generated document.{' '}
              <span className="float-right text-end">1/1</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
