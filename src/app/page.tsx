'use client';

// import { redirect, useSearchParams } from 'next/navigation';

// async function sendData(data: string) {
//   const res = await fetch('http://localhost:3000/encrypt', {
//     method: 'POST',
//     body: JSON.stringify({ data }),
//     cache: 'no-store',
//   });
//   if (!res.ok) throw new Error('failed to send data');
//   const b = await res.json();
//   redirect(`/decrypt?dec=${b.data}`);
// }

export default async function Home() {
  // const param = useSearchParams();
  // await sendData(param.get('enc') ?? 'placeholder');
  // console.log(param.get('enc'));
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>{JSON.stringify({ data: 'data' })}</h1>
      <input type="text" placeholder="hi" />
    </main>
  );
}
