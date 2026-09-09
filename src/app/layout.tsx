import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '../components/ThemeProvider';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
  title: 'aparatrambut — Cukur Rapi, Tanpa Nunggu Lama',
  description:
    'Tempat cukur personal dengan satu kursi, jadwal teratur, dan waktu yang cukup untuk setiap sesi.',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" data-visual-mode="dark" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-ap-bg text-ap-text selection:bg-ap-pink selection:text-white transition-colors antialiased">
        <ThemeProvider>
          <Header />
          <div className="flex-1 pt-20 flex flex-col">
            {children}
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
