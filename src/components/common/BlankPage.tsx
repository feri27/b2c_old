'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function BlankPage({
  dbtrAgt,
  endToEndId,
  endToEndIdSignature,
}: {
  dbtrAgt?: string;
  endToEndId?: string;
  endToEndIdSignature?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const channel = pathname.includes('/b2b') ? 'B2B' : 'B2C';
  useEffect(() => {
    if (!dbtrAgt || !endToEndId || !endToEndIdSignature) {
      router.push('/404');
    } else {
      sessionStorage.setItem(
        'merchantData',
        JSON.stringify({
          dbtrAgt,
          endToEndId,
          endToEndIdSignature: { populated: true, value: endToEndIdSignature },
          channel,
        })
      );
      if (channel === 'B2B') {
        router.replace('/b2b/loginb');
      } else {
        router.replace('/login');
      }
    }
  }, [dbtrAgt, endToEndId, endToEndIdSignature]);

  return <></>;
}
