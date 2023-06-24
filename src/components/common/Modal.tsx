export default function Modal({
  text,
  cb,
  isLoading,
}: {
  text: string;
  cb: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="z-100 fixed inset-0 bg-black opacity-70">
      <div className="z-100 fixed top-[50%] left-[50%] w-[80%] -translate-x-[50%] -translate-y-[50%] transform  rounded bg-gray-200 md:w-[30%] h-[40%] flex flex-col items-center justify-evenly">
        <p className="text-xl text-red-500">{text}</p>
        <button
          disabled={isLoading}
          className="disabled:cursor-not-allowed disabled:opacity-50 rounded bg-red-500 px-4 py-1 text-white"
          onClick={cb}
        >
          OK
        </button>
      </div>
    </div>
  );
}
