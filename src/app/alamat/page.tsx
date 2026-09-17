import Link from 'next/link';

export default function AlamatPage() {
  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      {/* Header */}
      <section className="pb-12 border-b border-ap-line">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-ap-pink">
              <span className="w-2 h-2 rounded-full bg-ap-pink"></span>
              <span className="font-meta-label text-xs uppercase tracking-widest text-ap-text font-bold">
                LOKASI & KONTAK
              </span>
            </div>
            <div className="space-y-1 font-meta-code text-xs text-ap-muted">
              <p>STUDIO TEMBALANG, SEMARANG</p>
              <p>Buka setiap hari</p>
              <p>10.00 – 21.00 WIB</p>
            </div>
          </div>

          <div className="md:col-span-8 flex flex-col">
            <h1 className="font-headline-lg text-3xl sm:text-5xl lg:text-6xl font-extrabold text-ap-text tracking-tight lowercase">
              Lokasi studio,<br />
              <span className="text-ap-pink font-normal">jam buka & petunjuk arah.</span>
            </h1>
            <p className="font-body-lg text-base sm:text-lg text-ap-muted mt-6 max-w-2xl leading-relaxed">
              Studio kami berada di kawasan Tembalang, dekat kampus Undip Semarang. Tempat mudah dijangkau dengan area parkir motor dan mobil yang aman. Datanglah sesuai jadwal booking yang kamu pesan.
            </p>
          </div>
        </div>
      </section>

      {/* Main Details Grid */}
      <section className="py-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Address, Hours, Contact Card */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="bg-ap-surface-low border border-ap-line p-8 flex flex-col gap-6">
            <div>
              <span className="font-meta-label text-xs uppercase text-ap-pink font-semibold tracking-wider">
                Alamat Fisik Studio
              </span>
              <h2 className="font-headline-sm text-2xl font-bold text-ap-text mt-1">
                Jl. Banjarsari Selatan No.88, Pedalangan, Kec. Tembalang
              </h2>
              <p className="font-meta-code text-xs text-ap-muted mt-1">
                Kota Semarang, Jawa Tengah 50275
              </p>
            </div>

            <div className="p-4 bg-ap-surface border border-ap-line flex flex-col gap-2">
              <span className="font-meta-label text-[11px] uppercase tracking-wider text-ap-text font-bold">
                Petunjuk Arah & Parkir
              </span>
              <p className="font-body-sm text-xs text-ap-muted leading-relaxed">
                Pinggir jalan utama Banjarsari Selatan, sekitar 3 menit dari gerbang Universitas Diponegoro (Undip) Tembalang. Parkir motor dan mobil aman tersedia tepat di depan studio.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <span className="font-meta-label text-xs uppercase text-ap-text font-semibold tracking-wider">
                Jam Operasional
              </span>
              <div className="flex items-center justify-between text-xs font-meta-code text-ap-muted border-b border-ap-line/40 py-2">
                <span>Senin – Minggu (Buka Setiap Hari)</span>
                <span className="text-ap-text font-bold">10.00 – 21.00 WIB</span>
              </div>
              <div className="flex items-center justify-between text-xs font-meta-code text-ap-muted py-2">
                <span>Booking Online Terakhir</span>
                <span className="text-ap-pink font-bold">20.00 WIB</span>
              </div>
            </div>

            <div className="pt-4 border-t border-ap-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="font-meta-label text-xs uppercase text-ap-muted">
                  Kontak WhatsApp
                </span>
                <span className="font-meta-code text-xs text-ap-text font-bold">
                  [Nomor WhatsApp]
                </span>
              </div>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-5 py-2.5 rounded-[12px] bg-ap-surface border border-ap-line text-ap-pink hover:bg-ap-pink hover:text-white font-meta-label text-xs uppercase font-bold tracking-wider transition-colors"
              >
                Chat WhatsApp ↗
              </a>
            </div>
          </div>

          {/* Lateness Policy Note */}
          <div className="p-6 bg-ap-surface border border-ap-line flex items-start gap-4">
            <span className="text-ap-pink text-xl font-bold">ℹ</span>
            <div className="flex flex-col gap-1">
              <h3 className="font-headline-sm text-sm font-bold text-ap-text">
                Terlambat di Perjalanan?
              </h3>
              <p className="font-body-sm text-xs text-ap-muted leading-relaxed">
                Kami memahami lalu lintas dan kendala tak terduga. Jika kamu terlambat, segera kabari kami via WhatsApp agar jadwalmu tetap kami amankan, atau gunakan fitur Ubah Jadwal di tiket digitalmu.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Map Visualizer */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="bg-ap-surface-low border border-ap-line p-8 flex flex-col justify-between h-full">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-meta-label text-xs uppercase text-ap-text font-semibold tracking-wider">
                  Peta Navigasi
                </span>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-meta-code text-xs text-ap-pink hover:underline inline-flex items-center gap-1 font-bold"
                >
                  Buka di Google Maps ↗
                </a>
              </div>

              {/* Map Placeholder Card */}
              <div className="relative w-full aspect-[4/3] bg-ap-surface-lowest border border-ap-line overflow-hidden flex items-center justify-center p-6 text-center">
                <div
                  className="absolute inset-0 opacity-40 bg-cover bg-center grayscale"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB1LTF6hRHYWL5eHvsp0LbNCe194iHRjRGU7ejeLOtLYA_Cn19os2qcn5FibZU9s9PFUl9GL5rNCIXRyv00NzZSSzfqhPz545uKebkEPi6gLNj3xqz9ev37utpDSy2SRS5Ju0913dQWiPRptdUAICL-rE6WR3OX7ocZBg4TZu8BRSH5ZYJR_01Q4obDD2DhMzT5_U2782NLfEI8RfkReY0Io65NrWvDCqP3_w_jVyMie940KtayUl5J')",
                  }}
                ></div>
                <div className="absolute inset-0 bg-black/50"></div>

                <div className="relative z-10 flex flex-col items-center gap-3 p-6 bg-ap-surface/90 border border-ap-line max-w-sm">
                  <div className="w-3 h-3 rounded-full bg-ap-pink"></div>
                  <span className="font-headline-sm text-base font-bold text-ap-text">
                    aparatrambut Studio
                  </span>
                  <p className="font-meta-code text-xs text-ap-muted">
                    Jl. Banjarsari Selatan No.88, Pedalangan, Kec. Tembalang, Kota Semarang
                  </p>
                  <a
                    href="https://maps.google.com/?q=Jl.+Banjarsari+Selatan+No.88,+Pedalangan,+Kec.+Tembalang,+Kota+Semarang,+Jawa+Tengah+50275"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 px-4 py-2 rounded-[12px] bg-ap-text text-ap-bg hover:bg-ap-pink hover:text-white font-meta-code text-xs uppercase font-semibold transition-colors"
                  >
                    Petunjuk Arah Maps →
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-ap-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <span className="font-meta-code text-xs text-ap-muted">
                Sudah tahu jadwal luangmu?
              </span>
              <Link
                href="/booking"
                className="w-full sm:w-auto text-center px-6 py-3 rounded-[12px] bg-ap-pink hover:bg-ap-text text-white font-meta-label text-xs uppercase font-bold tracking-wider transition-colors shadow-lg"
              >
                Pilih Jadwal Booking Sekarang ↗
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
