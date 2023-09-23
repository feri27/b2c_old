import Layout from '@/components/b2b/Layout';

export default function Maintenance() {
  return (
    <Layout maintenance={true}>
      <div className="min-[1200px]:max-w-[960px] my-auto min-[992px]:max-w-[890px] md:max-w-[720px] min-[576px]:max-w-[540px] mx-auto py-12 text-[#212529] ">
        <div className="mb-5 max-[425px]:py-[15px] max-[425px]:px-5 py-[5px] px-10 shadow-[4px_4px_5px_0_rgba(0,0,0,0.27)] text-center bg-white">
          <div className="pt-2">Dear Valued Customer,</div>
          <div className="my-6">
            i-bizRAKYAT currently unable to accept FPX Payments due to system
            maintenance. Kindly contact 1-300-80-5454 should you require
            additional information. We apologise for any inconvenience caused.
          </div>
          <div className="mb-5 flex justify-center flex-wrap items-center space-x-2">
            <p>Thank you for using</p>
            <img
              src="/images/layout_set_logo.png"
              width="300px"
              className="img-thumbnail"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
