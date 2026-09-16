import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="w-full max-w-md mx-auto px-4 py-24 flex flex-col items-center text-center gap-6">
      <div className="w-12 h-12 rounded-full bg-ap-soft-pink text-ap-pink flex items-center justify-center font-meta-code text-xl font-bold">
        404
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="font-headline-sm text-2xl font-bold text-ap-text">
          Halaman Tidak Ditemukan
        </h1>
        <p className="font-body-sm text-xs text-ap-muted leading-relaxed">
          Alamat yang kamu tuju tidak ditemukan atau sudah dipindahkan. Mau potong rambut atau cek jadwal yang masih kosong?
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
        <Link
          href="/booking"
          className="w-full sm:w-auto px-6 py-3 rounded-[12px] bg-ap-pink text-white font-meta-label text-xs uppercase font-bold tracking-wider hover:bg-ap-text transition-colors text-center"
        >
          Lihat Jadwal Booking ↗
        </Link>
        <Link
          href="/"
          className="w-full sm:w-auto px-6 py-3 rounded-[12px] border border-ap-line text-ap-text font-meta-label text-xs uppercase font-bold tracking-wider hover:bg-ap-surface-low transition-colors text-center"
        >
          Kembali ke Beranda →
        </Link>
      </div>
    </div>
  );
}
