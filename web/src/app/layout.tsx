// app/layout.tsx
import { Inter, Poppins } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { ClerkProvider } from '@clerk/nextjs';
import MainFooter from '../components/Footer/index';
import MainNavbar from '../components/Navbar';
import { QueryProvider } from '../providers/query';
import { ThemeProvider } from '../providers/theme';
import '../styles/globals.css';
import type { ChildrenProps } from '../types';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  adjustFontFallback: false,
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata = {
  title: 'YouTube PE Tracker | Private Equity Acquisitions Database',
  description:
    'Community-driven database tracking private equity acquisitions and investments in YouTube channels. Discover which channels have been acquired by PE firms.',
  keywords:
    'youtube, private equity, acquisitions, database, channels, pe firms, investments, content creators, media acquisitions',
  authors: [{ name: 'YouTube PE Tracker Community' }],
  creator: 'YouTube PE Tracker Community',
  // metadataBase: new URL('https://yt-pe-tracker.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yt-pe-tracker.com',
    title: 'YouTube PE Tracker | Private Equity Acquisitions Database',
    description:
      'Community-driven database tracking private equity acquisitions and investments in YouTube channels',
    siteName: 'YouTube PE Tracker',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YouTube PE Tracker',
    description:
      'Community-driven database tracking private equity acquisitions in YouTube channels',
    creator: '@ytpetracker',
  },
};

export default function RootLayout({ children }: ChildrenProps) {
  return (
    <ClerkProvider>
      <html lang='en' suppressHydrationWarning className='overflow-x-hidden'>
        <body
          className={`${inter.variable} ${poppins.variable} font-sans antialiased overflow-x-hidden`}
        >
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
            <QueryProvider>
              <div className='flex min-h-screen bg-[var(--background)] w-full overflow-x-hidden'>
                <div className='flex-1 flex flex-col w-full'>
                  <MainNavbar />
                  <main className='flex-1 w-full overflow-x-hidden'>{children}</main>
                  <MainFooter />
                </div>
              </div>
              <Toaster
                position='bottom-right'
                toastOptions={{
                  className: 'bg-[var(--card)] text-[var(--foreground)] border-[var(--border)]',
                  duration: 3000,
                }}
              />
            </QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
