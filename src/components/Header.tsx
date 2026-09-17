'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';

export function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll and listen for Escape key when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setMobileMenuOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-ap-bg border-b border-ap-line transition-colors">
        <div className="h-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Brand & Operating Hours */}
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="w-2.5 h-2.5 rounded-full bg-ap-pink group-hover:scale-110 transition-transform"></span>
              <span className="font-headline-sm text-xl font-extrabold tracking-tight lowercase text-ap-text group-hover:text-ap-pink transition-colors">
                aparatrambut
              </span>
            </Link>

            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-ap-surface-low border border-ap-line">
              <span className="w-1.5 h-1.5 rounded-full bg-ap-pink"></span>
              <span className="font-meta-label text-[11px] uppercase tracking-wider text-ap-muted">
                Buka Setiap Hari 10.00–21.00 WIB
              </span>
            </div>
          </div>

          {/* Center: Main Nav (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-meta-label text-xs uppercase tracking-widest">
            <Link
              href="/layanan"
              className={`transition-colors hover:text-ap-pink ${
                isActive('/layanan') ? 'text-ap-pink font-bold' : 'text-ap-muted'
              }`}
            >
              Layanan
            </Link>
            <Link
              href="/tentang"
              className={`transition-colors hover:text-ap-pink ${
                isActive('/tentang') ? 'text-ap-pink font-bold' : 'text-ap-muted'
              }`}
            >
              Tentang
            </Link>
            <Link
              href="/alamat"
              className={`transition-colors hover:text-ap-pink ${
                isActive('/alamat') ? 'text-ap-pink font-bold' : 'text-ap-muted'
              }`}
            >
              Alamat
            </Link>
          </nav>

          {/* Right: Theme Toggle, Booking CTA & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-[10px] bg-ap-surface-low border border-ap-line text-ap-muted hover:text-ap-text hover:border-ap-pink transition-all active:scale-95"
              title={theme === 'dark' ? 'Tampilan Terang' : 'Tampilan Gelap'}
              aria-label={theme === 'dark' ? 'Tampilan Terang' : 'Tampilan Gelap'}
            >
              <Image
                src={theme === 'dark' ? '/icons/light-mode.png' : '/icons/dark-mode.png'}
                alt={theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
                width={18}
                height={18}
                className={`w-4.5 h-4.5 object-contain transition-transform ${
                  theme === 'dark' ? 'invert' : ''
                }`}
                priority
              />
            </button>

            {/* Primary Action Booking */}
            <Link
              href="/booking"
              className="inline-flex items-center justify-center min-h-[40px] sm:min-h-[44px] px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-[12px] bg-ap-text text-ap-bg font-meta-label text-xs uppercase font-bold tracking-wider hover:bg-ap-pink hover:text-white transition-all active:scale-[0.98]"
            >
              <span>Booking</span>
              <span className="hidden xs:inline ml-1">↗</span>
            </Link>

            {/* Mobile Menu Hamburger Button (Hidden on md+) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
              className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-[10px] bg-ap-surface-low border border-ap-line text-ap-text hover:border-ap-pink transition-colors active:scale-95"
            >
              <span
                className={`w-5 h-0.5 bg-ap-text transition-all duration-300 ${
                  mobileMenuOpen ? 'rotate-45 translate-y-2 bg-ap-pink' : ''
                }`}
              ></span>
              <span
                className={`w-5 h-0.5 bg-ap-text transition-all duration-300 ${
                  mobileMenuOpen ? 'opacity-0' : ''
                }`}
              ></span>
              <span
                className={`w-5 h-0.5 bg-ap-text transition-all duration-300 ${
                  mobileMenuOpen ? '-rotate-45 -translate-y-2 bg-ap-pink' : ''
                }`}
              ></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer (Full-Screen Minimalist Editorial Overlay inspired by OKC Media) */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Menu Navigasi Mobile"
          className="fixed inset-0 z-50 bg-ap-bg md:hidden flex flex-col justify-between p-6 sm:p-8 overflow-y-auto"
        >
          {/* Top Bar inside overlay: Brand, Theme Toggle & Close Button */}
          <div className="flex items-center justify-between pb-4">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 group"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-ap-pink group-hover:scale-110 transition-transform"></span>
              <span className="font-headline-sm text-xl font-extrabold tracking-tight lowercase text-ap-text">
                aparatrambut
              </span>
            </Link>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={toggleTheme}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-ap-surface-low border border-ap-line text-ap-muted hover:text-ap-text hover:border-ap-pink transition-all active:scale-95"
                title={theme === 'dark' ? 'Tampilan Terang' : 'Tampilan Gelap'}
                aria-label={theme === 'dark' ? 'Tampilan Terang' : 'Tampilan Gelap'}
              >
                <Image
                  src={theme === 'dark' ? '/icons/light-mode.png' : '/icons/dark-mode.png'}
                  alt={theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
                  width={18}
                  height={18}
                  className={`w-4.5 h-4.5 object-contain transition-transform ${
                    theme === 'dark' ? 'invert' : ''
                  }`}
                  priority
                />
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Tutup menu navigasi"
                className="w-10 h-10 rounded-full bg-ap-surface-low border border-ap-line text-ap-text hover:text-ap-pink hover:border-ap-pink flex items-center justify-center transition-colors active:scale-95 text-lg"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Center: Bold Editorial Lowercase Links */}
          <nav className="flex flex-col gap-6 my-auto py-8">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`font-headline-lg text-4xl sm:text-5xl font-extrabold tracking-tight lowercase transition-colors ${
                pathname === '/' ? 'text-ap-pink' : 'text-ap-text hover:text-ap-pink'
              }`}
            >
              beranda
            </Link>

            <Link
              href="/layanan"
              onClick={() => setMobileMenuOpen(false)}
              className={`font-headline-lg text-4xl sm:text-5xl font-extrabold tracking-tight lowercase transition-colors ${
                isActive('/layanan') ? 'text-ap-pink' : 'text-ap-text hover:text-ap-pink'
              }`}
            >
              layanan
            </Link>

            <Link
              href="/tentang"
              onClick={() => setMobileMenuOpen(false)}
              className={`font-headline-lg text-4xl sm:text-5xl font-extrabold tracking-tight lowercase transition-colors ${
                isActive('/tentang') ? 'text-ap-pink' : 'text-ap-text hover:text-ap-pink'
              }`}
            >
              tentang
            </Link>

            <Link
              href="/alamat"
              onClick={() => setMobileMenuOpen(false)}
              className={`font-headline-lg text-4xl sm:text-5xl font-extrabold tracking-tight lowercase transition-colors ${
                isActive('/alamat') ? 'text-ap-pink' : 'text-ap-text hover:text-ap-pink'
              }`}
            >
              alamat
            </Link>

            {/* CTA Button */}
            <div className="pt-2">
              <Link
                href="/booking"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[12px] bg-ap-pink hover:bg-ap-text text-white font-meta-label text-xs uppercase font-bold tracking-widest transition-colors shadow-lg active:scale-95"
              >
                <span>Pilih Jadwal Potong</span>
                <span>↗</span>
              </Link>
            </div>
          </nav>

          {/* Bottom: Minimal Studio Telemetry */}
          <div className="flex flex-col gap-1.5 pt-6 border-t border-ap-line font-meta-code text-xs text-ap-muted">
            <div className="flex items-center gap-2 text-ap-text font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-ap-pink"></span>
              <span>10.00 – 21.00 WIB • Buka Setiap Hari</span>
            </div>
            <p className="text-[11px] text-ap-muted">
              Jl. Banjarsari Selatan No.88, Tembalang, Semarang
            </p>
          </div>
        </div>
      )}
    </>
  );
}
