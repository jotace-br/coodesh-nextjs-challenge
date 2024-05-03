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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='en'
      className='antialiased bg-background text-slate-50'
      suppressHydrationWarning
    >
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
