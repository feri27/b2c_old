import './globals.css';
import localFont from 'next/font/local';
import Provider from '@/utils/provider';

const font = localFont({
  src: '../../public/font/calibri.ttf',
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
});

export const metadata = {
  title: 'B2C',
  description: '',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${font.className} bg-[rgba(249,249,249,255)]`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
