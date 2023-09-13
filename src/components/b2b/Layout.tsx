import { ReactNode } from 'react';
import Header from '@/components/b2b/Header';
import Footer from '@/components/b2b/Footer';

export default function Layout({
  maintenance = false,
  children,
}: {
  maintenance?: boolean;
  children: ReactNode;
}) {
  return (
    <>
      <Header maintenance={maintenance} />
      <main className="relative h-between-b2b bg-[url(/images/bg.jpg)]">
        <div className="w-full h-[45px] opacity-60 bg-white" />
        {children}
      </main>
      <Footer maintenance={maintenance} />
    </>
  );
}
