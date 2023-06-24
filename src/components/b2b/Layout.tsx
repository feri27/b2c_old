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
      <main className="relative min-h-[100px] bg-[url(/images/bg.jpg)]">
        <div className="w-full h-[45px] opacity-60 bg-white" />
        {children}
      </main>
      <Footer maintenance={maintenance} />
    </>
  );
}
