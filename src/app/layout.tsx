import { Inter as FontSans } from 'next/font/google';
import './globals.css';

import { Sidebar } from '@components/sidebar/sidebar';
import { Toaster } from '@components/ui/sonner';
import { cn } from '@utils/shadcn-utils';
import { RadioProvider } from 'contexts/radio-context';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata = {
  title: 'Radio Seeker',
  description:
    'Radio Seeker is a radio station search engine. Search for your favorite radio stations and listen to them for free.',
  keywords: 'radio, music, search, station',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className='antialiased bg-background text-slate-50'>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <main>
          <RadioProvider>
            <Sidebar content={children} />
          </RadioProvider>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
