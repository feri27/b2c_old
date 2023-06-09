export default function AccountSelection() {
  return (
    <>
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
                <input type="hidden" name="fromAcc" id="fromAcc" value="" />
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
    </>
  );
}
