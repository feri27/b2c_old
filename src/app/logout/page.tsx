'use client';
import Header from '@/components/Header';
import LoginFooter from '@/components/LoginFooter';
import SeparatorLine from '@/components/SeparatorLine';
import Link from 'next/link';
import { useState } from 'react';

export default function Logout() {
  const [date, _] = useState(new Date());
  function getDate() {
    const day = date.getDate().toString().padStart(2, '0');
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const month = monthNames[monthIndex];
    return `${day}-${month}-${year}`;
  }
  function getCurrentTime() {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    let hours12 = hours % 12;
    hours12 = hours12 ? hours12 : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    const timeStr = hours12 + ':' + minutesStr + ' ' + ampm;
    return timeStr;
  }
  return (
    <>
      <Header logout={true} backgroundImg={true} />
      <SeparatorLine />
      <div className="min-[576px]:max-w-[540px] md:max-w-[720px] min-[992px]:max-w-[890px] min-[1200px]:max-w-[960px] min-[1400px]:max-w-[1060px] min-[1600px]:max-w-[1220px] mx-auto h-between-ml">
        <div className="text-[#e9730d] text-lg leading-[1.2] mb-2 mt-12">
          <h3 className="text-3xl font-medium">
            You have successfully logged out!
          </h3>
        </div>
        <p className="mb-1 text-gray-500">You have logged out from iRakyat.</p>

        <div className="flex my-2  mx-auto text-xs font-bold mt-2.5 text-red-500 font-verdana">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            fill="currentColor"
            className="bi bi-info-circle-fill"
            viewBox="0 0 16 16"
          >
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
          </svg>
          &nbsp;Another login session is detected. Please contact our Customer
          Service at 1-300-80-5454 or +603-5526 9000 (for overseas call) for
          assistance.
        </div>
        <p className="my-2 block text-gray-500">
          Logout Date, Time: {getDate()} {getCurrentTime()}
        </p>
        <p className="my-2">
          Thank you for using iRakyat. Click{' '}
          <Link href="/" className="text-blue-500 hover:underline">
            here
          </Link>{' '}
          to login again.
        </p>
        <p className="!mb-12">
          As an added privacy measure, you are advised to clear your cache after
          each session.
        </p>
      </div>
      <LoginFooter />
    </>
  );
}
