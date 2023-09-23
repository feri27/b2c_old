import { ReactNode } from 'react';
import Header from '@/components/b2b/Header';
import Footer from '@/components/b2b/Footer';

export default function Layout({
  maintenance = false,
  logout = false,
  children,
}: {
  maintenance?: boolean;
  logout?: boolean;
  children: ReactNode;
}) {
  const height = logout || maintenance ? 'h-between-b2b-ml' : 'h-between-b2b';
  return (
    <>
      <Header maintenance={maintenance} logout={logout} />
      <main className={`relative ${height} bg-[url(/images/bg.jpg)]`}>
        {!logout && <div className="w-full h-[45px] opacity-60 bg-white" />}
        {children}
      </main>
      <Footer maintenance={maintenance || logout} />
    </>
  );
}
