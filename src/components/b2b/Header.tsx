import Image from 'next/image';

export default function Header() {
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
      <div className="h-10 bg-[#005aaa]" />
    </header>
  );
}
