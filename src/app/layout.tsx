import { Inter as FontSans } from 'next/font/google';
import './globals.css';

import { Sidebar } from '@components/sidebar';
import { cn } from '@utils/shadcn-utils';

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
        <Sidebar content={children} />
      </body>
    </html>
  );
}
