'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';

export function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-ap-bg/90 backdrop-blur-md border-b border-ap-line transition-colors">
      <div className="h-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand & Operating Hours */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="w-2.5 h-2.5 rounded-full bg-ap-pink group-hover:scale-110 transition-transform"></span>
            <span className="font-headline-sm text-xl font-extrabold tracking-tight lowercase text-ap-text group-hover:text-ap-pink transition-colors">
              aparatrambut
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-ap-surface-low border border-ap-line">
            <span className="w-1.5 h-1.5 rounded-full bg-ap-pink"></span>
            <span className="font-meta-label text-[11px] uppercase tracking-wider text-ap-muted">
              10.00–21.00 WIB
            </span>
          </div>
        </div>

        {/* Center: Main Nav (Hidden on small mobile) */}
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

        {/* Right: Theme Toggle, Admin link, Booking CTA */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-[10px] bg-ap-surface-low border border-ap-line text-ap-muted hover:text-ap-text hover:border-ap-pink transition-all active:scale-95"
            title={theme === 'dark' ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'}
            aria-label={theme === 'dark' ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'}
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

          {/* Admin link */}
          <Link
            href="/admin"
            className={`hidden lg:inline-block font-meta-code text-xs transition-colors ${
              pathname.startsWith('/admin')
                ? 'text-ap-pink font-bold'
                : 'text-ap-muted hover:text-ap-pink'
            }`}
          >
            /admin
          </Link>

          {/* Primary Action Booking */}
          <Link
            href="/booking"
            className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-[12px] bg-ap-text text-ap-bg font-meta-label text-xs uppercase font-bold tracking-wider hover:bg-ap-pink hover:text-white transition-all active:scale-[0.98]"
          >
            Booking
          </Link>
        </div>
      </div>
    </header>
  );
}
