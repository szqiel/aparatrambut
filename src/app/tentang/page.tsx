import Link from 'next/link';

export default function TentangPage() {
  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      {/* Header */}
      <section className="pb-12 border-b border-ap-line">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-ap-pink">
              <span className="w-2 h-2 rounded-full bg-ap-pink"></span>
              <span className="font-meta-label text-xs uppercase tracking-widest text-ap-text font-bold">
                TENTANG KAMI
              </span>
            </div>
            <div className="space-y-1 font-meta-code text-xs text-ap-muted">
              <p>Barbershop di Tembalang, Semarang</p>
              <p>Cukur nyaman</p>
              <p>Tanpa antrian panjang</p>
            </div>
          </div>

          <div className="md:col-span-8 flex flex-col">
            <h1 className="font-headline-lg text-3xl sm:text-5xl lg:text-6xl font-extrabold text-ap-text tracking-tight lowercase">
              tampil maksimal,<br />
              <span className="text-ap-pink font-normal">langsung dipangkas tanpa antri.</span>
            </h1>
            <p className="font-body-lg text-base sm:text-lg text-ap-muted mt-6 max-w-2xl leading-relaxed">
              aparatrambut, hadir untuk pria yang ingin tampil maksimal. Kami menghilangkan kebiasaan menunggu berjam-jam di ruang tunggu barbershop yang penuh sesak.
            </p>
            <p className="font-body-lg text-base sm:text-lg text-ap-muted mt-3 max-w-2xl leading-relaxed">
              Dengan sistem pemesanan online per jam, kamu datang pada waktu yang kamu pilih dan langsung duduk di kursi. Setiap tamu mendapatkan waktu 60 menit yang tenang, pengerjaan teliti, dan kebersihan alat yang terjamin.
            </p>
          </div>
        </div>
      </section>

      {/* Narrative Points */}
      <section className="py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-ap-surface-low border border-ap-line p-8 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <span className="font-meta-code text-xs text-ap-pink font-bold">01 JADWAL PASTI</span>
            <h2 className="font-headline-sm text-xl font-bold text-ap-text">
              Satu Orang per Jadwal
            </h2>
            <p className="font-body-sm text-xs text-ap-muted leading-relaxed">
              Slot yang kamu pesan tidak ditumpuk dengan orang lain. Datang tepat waktu, langsung dicukur tanpa perlu menunggu giliran.
            </p>
          </div>
          <div className="pt-6 border-t border-ap-line text-[11px] font-meta-code text-ap-muted">
            Kapasitas: 1 Tamu per Jam
          </div>
        </div>

        <div className="bg-ap-surface-low border border-ap-line p-8 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <span className="font-meta-code text-xs text-ap-pink font-bold">02 WAKTU 60 MENIT</span>
            <h2 className="font-headline-sm text-xl font-bold text-ap-text">
              Pengerjaan Tenang & Teliti
            </h2>
            <p className="font-body-sm text-xs text-ap-muted leading-relaxed">
              Waktu 60 menit memastikan kapster dapat memotong detail, mencuci rambut, kompres handuk hangat, hingga pijat leher tanpa terburu-buru.
            </p>
          </div>
          <div className="pt-6 border-t border-ap-line text-[11px] font-meta-code text-ap-muted">
            Durasi: 60 Menit / Rp50.000
          </div>
        </div>

        <div className="bg-ap-surface-low border border-ap-line p-8 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <span className="font-meta-code text-xs text-ap-pink font-bold">03 HIGIENIS & BERSIH</span>
            <h2 className="font-headline-sm text-xl font-bold text-ap-text">
              Alat Bersih & Pisau Baru
            </h2>
            <p className="font-body-sm text-xs text-ap-muted leading-relaxed">
              Pisau silet selalu diganti baru untuk tiap orang di depanmu. Sisir, clipper, dan gunting selalu disanitasi sebelum tamu berikutnya duduk.
            </p>
          </div>
          <div className="pt-6 border-t border-ap-line text-[11px] font-meta-code text-ap-muted">
            Standar kebersihan terjaga
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="p-8 sm:p-12 bg-ap-surface border border-ap-line flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <span className="font-meta-label text-xs uppercase tracking-widest text-ap-pink font-semibold">
            CARA MEMESAN JADWAL
          </span>
          <h2 className="font-headline-sm text-2xl font-bold text-ap-text">
            Alur Booking Cepat Tanpa Akun
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex flex-col gap-2">
            <span className="font-meta-code text-sm text-ap-pink font-bold">Langkah 1</span>
            <h3 className="font-headline-sm text-base font-semibold text-ap-text">Pilih Layanan</h3>
            <p className="font-body-sm text-xs text-ap-muted">
              Tentukan Reguler, Shaving, atau Hair SPA. Semua flat Rp50.000 dan berdurasi 60 menit.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-meta-code text-sm text-ap-pink font-bold">Langkah 2</span>
            <h3 className="font-headline-sm text-base font-semibold text-ap-text">Pilih Jam</h3>
            <p className="font-body-sm text-xs text-ap-muted">
              Pilih hari dan jam potong yang masih tersedia antara pukul 10.00 hingga 20.00 WIB.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-meta-code text-sm text-ap-pink font-bold">Langkah 3</span>
            <h3 className="font-headline-sm text-base font-semibold text-ap-text">Isi Kontak</h3>
            <p className="font-body-sm text-xs text-ap-muted">
              Tuliskan nama pengunjung dan nomor WhatsApp untuk pengiriman tiket digital. Tanpa perlu daftar akun.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-meta-code text-sm text-ap-pink font-bold">Langkah 4</span>
            <h3 className="font-headline-sm text-base font-semibold text-ap-text">Simpan Tiket</h3>
            <p className="font-body-sm text-xs text-ap-muted">
              Tunjukkan tiket saat tiba di studio. Kamu bisa ubah jadwal bebas biaya, lalu bayar di kasir setelah pangkas selesai.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-ap-line flex items-center justify-between">
          <span className="font-meta-code text-xs text-ap-muted">
            Siap untuk mencoba?
          </span>
          <Link
            href="/booking"
            className="px-6 py-3 rounded-[12px] bg-ap-pink hover:bg-ap-text text-white font-meta-label text-xs uppercase font-bold tracking-widest transition-colors"
          >
            Booking Jadwal Sekarang ↗
          </Link>
        </div>
      </section>
    </div>
  );
}
