import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-[100px] bg-[url(/images/bg.jpg)]">
      <div className="w-full h-[45px] opacity-60 bg-white" />
      {children}
    </main>
  );
}
