import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full bg-ap-surface-lowest text-ap-muted pt-16 pb-12 border-t border-ap-line">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12">
          {/* Col 1: Brand & Philosophy */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-ap-pink"></span>
              <span className="font-headline-sm text-xl font-bold lowercase text-ap-text tracking-tight">
                aparatrambut
              </span>
            </div>
            <p className="font-body-sm text-xs text-ap-muted max-w-sm leading-relaxed">
              Tempat cukur personal dengan jadwal yang jelas dan waktu yang cukup untuk tiap orang.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="w-2 h-2 rounded-full bg-ap-pink"></span>
              <span className="font-meta-code text-xs text-ap-text">Booking tersedia setiap hari</span>
            </div>
          </div>

          {/* Col 2: Studio Location */}
          <div className="md:col-span-3 flex flex-col gap-2">
            <span className="font-meta-label text-xs uppercase tracking-widest text-ap-text font-semibold">
              Lokasi Studio
            </span>
            <p className="font-body-sm text-xs text-ap-muted leading-relaxed">
              Jl. Banjarsari Selatan No.88, Pedalangan, Kec. Tembalang, Kota Semarang, Jawa Tengah 50275
            </p>
            <p className="font-meta-time text-xs text-ap-muted pt-1">
              Lihat peta untuk petunjuk jalan.
            </p>
          </div>

          {/* Col 3: Hours & Contact */}
          <div className="md:col-span-3 flex flex-col gap-2">
            <span className="font-meta-label text-xs uppercase tracking-widest text-ap-text font-semibold">
              Operasional & Kontak
            </span>
            <p className="font-meta-time text-xs text-ap-muted">
              Setiap hari<br />
              10.00 – 21.00 WIB
            </p>
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-meta-code text-xs text-ap-pink hover:text-ap-text transition-colors pt-2"
            >
              WhatsApp →
            </a>
          </div>

          {/* Col 4: Navigation */}
          <div className="md:col-span-2 flex flex-col gap-2">
            <span className="font-meta-label text-xs uppercase tracking-widest text-ap-text font-semibold">
              Navigasi
            </span>
            <div className="flex flex-col gap-2 pt-1 font-meta-code text-xs text-ap-muted">
              <Link href="/layanan" className="hover:text-ap-text transition-colors">
                01. Layanan
              </Link>
              <Link href="/tentang" className="hover:text-ap-text transition-colors">
                02. Tentang
              </Link>
              <Link href="/alamat" className="hover:text-ap-text transition-colors">
                03. Alamat
              </Link>
              <Link href="/booking" className="hover:text-ap-pink transition-colors">
                04. Booking
              </Link>
              <Link href="/admin" className="hover:text-ap-pink transition-colors">
                05. Admin
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-ap-line/40 flex flex-col sm:flex-row items-center justify-between gap-4 font-meta-code text-xs text-ap-muted">
          <div className="flex items-center gap-4">
            <span>© 2026 aparatrambut.</span>
            <span>Kota Semarang</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-ap-muted/70">
            <a
              href="https://www.flaticon.com/free-icons/light-mode"
              title="light mode icons"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ap-text hover:underline transition-colors"
            >
              Light mode icons created by Any Icon - Flaticon
            </a>
            <span>•</span>
            <a
              href="https://www.flaticon.com/free-icons/dark-mode"
              title="dark mode icons"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ap-text hover:underline transition-colors"
            >
              Dark mode icons created by MekoDa - Flaticon
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
