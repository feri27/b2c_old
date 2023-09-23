import Footer from '@/components/Footer';
import Header from '@/components/Header';
import SeparatorLine from '@/components/SeparatorLine';

export default function Maintenance() {
  return (
    <>
      <Header />
      <SeparatorLine />
      <div className="min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] md:max-w-[720px] min-[576px]:max-w-[540px] mx-auto w-full padx75 text-[#212529] text-sm pb-[0.2px]">
        <div className="!mb-2">
          <div className="bg-white border border-solid border-[#ddd] !my-14 rounded shadow-[0_1px_1px_rgba(0,0,0,.05)]">
            <div className="py-[15px] px-[30px] ">
              <div className="!pt-2 !text-center">Dear Valued Customer,</div>
              <div className="!my-6 min-[992px]:w-[75%] mx-auto text-center block">
                Please be informed that we are currently conducting a scheduled
                system maintenance. The service is temporary unavailable during
                this period. We apologize for the inconvenience caused.
              </div>
              <div className="!mb-12 flex text-center items-center space-x-2 justify-center flex-wrap">
                <p>Thank you for using</p>
                <img
                  src="/images/irakyat.png"
                  className="img-thumbnail"
                  width="250px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
