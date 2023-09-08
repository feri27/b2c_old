export default function Logout() {
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
        <p>Logout Date, Time: 11-May-2023 11:40 AM</p>
        <p className="font-extrabold">
          Thank you for using iRakyat. Click here to login again.
        </p>
        <p className="font-extrabold">
          As an added privacy measure, you are advised to clear your cache after
          each session.
        </p>
      </div>
    </div>
  );
}
