import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '../components/ThemeProvider';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
  title: 'aparatrambut — Potong Rapi, Jadwal Pasti Tanpa Antre',
  description:
    'Barbershop satu kursi di Tembalang, Semarang. Pilih jam potong online, datang sesuai jadwal, langsung dicukur tanpa antre.',
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
