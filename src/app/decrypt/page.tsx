'use client';

import { useSearchParams } from 'next/navigation';

async function sendData(data: string) {
  const res = await fetch('http://localhost:3000/decrypt-api', {
    method: 'POST',
    body: JSON.stringify({ data }),
  });
  if (!res.ok) throw new Error('failed to send data');
  return res.json();
}

export default async function Home() {
  const params = useSearchParams();
  const dec = params.get('dec');
  const data = await sendData(dec ?? 'placeholder');

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>{JSON.stringify(data)}</h1>
    </main>
  );
}
