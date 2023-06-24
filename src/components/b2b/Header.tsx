import Image from 'next/image';

export default function Header({
  maintenance = false,
}: {
  maintenance?: boolean;
}) {
  return (
    <header>
      <nav className="border border-solid border-transparent relative rounded">
        <div className="py-[5px] px-[15px] ">
          <div className="marginx flex justify-between items-center">
            <div className="padx w-1/2 m-auto">
              <img
                src="/images/layout_set_logo.png"
                alt="Bank Rakyat Logo"
                className="p-1 max-w-full h-auto rounded md:h-[50px]"
              />
            </div>
            <div className="padx w-1/2 m-auto">
              <img
                src="/images/fpxlogo.png"
                alt="Bank Rakyat Logo"
                className="p-1 !pl-[10%] rounded !float-right max-w-full h-[50px]"
              />
            </div>
          </div>
        </div>
      </nav>
      <div className="h-12 md:h-10 bg-[#005aaa]">
        {maintenance && (
          <ul className="flex justify-center md:text-sm text-[13px] text-white space-x-4 items-center h-full flex-wrap">
            <li>
              <b>Prayer Time (Kuala Lumpur, MY)</b>
            </li>
            <li>
              <span className="mpt-prayer-0-name">Subuh&nbsp;</span>
              <span className="mpt-prayer-0-time">5:58 AM</span>
            </li>
            <li>
              <span className="mpt-prayer-2-name">Zohor&nbsp;</span>
              <span className="mpt-prayer-2-time">1:16 PM</span>
            </li>
            <li>
              <span className="mpt-prayer-3-name active">Asar&nbsp;</span>
              <span className="mpt-prayer-3-time active">4:27 PM</span>
            </li>
            <li>
              <span className="mpt-prayer-4-name">Maghrib&nbsp;</span>
              <span className="mpt-prayer-4-time">7:21 PM</span>
            </li>
            <li>
              <span className="mpt-prayer-5-name">Isyak&nbsp;</span>
              <span className="mpt-prayer-5-time">8:31 PM</span>
            </li>
          </ul>
        )}
      </div>
    </header>
  );
}
