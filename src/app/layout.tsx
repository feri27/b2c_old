import Header from '@/components/Header';
import './globals.css';
import { Inter } from 'next/font/google';
import Footer from '@/components/Footer';
import SeparatorLine from '@/components/SeparatorLine';
import Steps from '@/components/Steps';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} x`}>
        <Header />
        <SeparatorLine />
        <Steps title="Payment Details" step={1} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
