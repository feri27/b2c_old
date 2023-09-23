import Link from 'next/link';

export default function Logout() {
  const date = new Date();
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
    const date = new Date();
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
    <div className="max-w-7xl mx-auto mt-5 text-base">
      <h2 className="text-red-500 text-xl">
        You have successfully logged out!
      </h2>
      <div className="pl-3">
        <p>You have logged out from iRakyat</p>
        <strong className="font-extrabold">
          Another Login Session is Detected. Please contact our Customer Service
          at 1-300-80-5454 or +603-5526-9000 (for overseas call) for assistance.
        </strong>
        <p>
          Logout Date, Time: {getDate()} {getCurrentTime()}
        </p>
        <p className="font-extrabold">
          Thank you for using iRakyat.{' '}
          <Link href="/" className="text-blue-500">
            Click here to login again.
          </Link>
        </p>
        <p className="font-extrabold">
          As an added privacy measure, you are advised to clear your cache after
          each session.
        </p>
      </div>
    </div>
  );
}
