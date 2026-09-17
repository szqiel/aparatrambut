import Link from 'next/link';

export default function HomePage() {
  const services = [
    {
      id: 'svc-reguler',
      num: '01',
      name: 'Reguler Haircut',
      desc: 'Potong rambut sesuai permintaan, cuci rambut, kompres handuk hangat, pijat leher & bahu, tonic, dan styling pomade.',
      duration: '60 Menit',
      price: 'Rp50.000',
    },
    {
      id: 'svc-shaving',
      num: '02',
      name: 'Haircut + Shaving',
      desc: 'Potong rambut lengkap ditambah cukur kumis & jenggot dengan kompres handuk hangat, pisau silet baru steril sekali pakai, dan aftershave.',
      duration: '60 Menit',
      price: 'Rp50.000',
    },
    {
      id: 'svc-hairspa',
      num: '03',
      name: 'Haircut + Hair SPA',
      desc: 'Potong rambut dengan creambath kulit kepala untuk mengatasi ketombe dan lepek, ditambah pijat relaksasi kepala serta cooling tonic.',
      duration: '60 Menit',
      price: 'Rp50.000',
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full px-4 sm:px-6 lg:px-8 pt-10 lg:pt-16 pb-12 lg:pb-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          {/* Left Narrative */}
          <div className="lg:col-span-8 flex flex-col items-start gap-4">
            <div className="inline-flex items-center gap-2 bg-ap-surface-low border border-ap-line px-3 py-1">
              <span className="w-2 h-2 rounded-full bg-ap-pink"></span>
              <span className="font-meta-label text-xs uppercase text-ap-text tracking-wider">
                APARATRAMBUT • TEMBALANG, SEMARANG
              </span>
            </div>

            <h1 className="font-headline-lg text-3xl sm:text-5xl lg:text-7xl font-extrabold text-ap-text tracking-tight leading-[1.05]">
              potong rapi,{' '}
              <span className="text-ap-pink italic font-normal">jadwal pasti tanpa antre.</span>
            </h1>

            <p className="font-body-lg text-base sm:text-lg text-ap-muted max-w-2xl leading-relaxed">
              Pilih jam potong online, datang sesuai jadwal, langsung dicukur tanpa buang waktu menunggu giliran.
            </p>
          </div>

          {/* Right Operational Telemetry & CTA */}
          <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-between gap-6 lg:h-full">
            <div className="flex flex-col items-start lg:items-end gap-1 text-left lg:text-right">
              <span className="font-meta-label text-xs text-ap-muted uppercase tracking-widest">
                Jam Operasional
              </span>
              <p className="font-meta-time text-sm font-semibold text-ap-text">
                10.00 – 21.00 WIB • BUKA SETIAP HARI
              </p>
              <div className="inline-flex items-center gap-2 pt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-ap-pink"></span>
                <span className="font-meta-code text-xs text-ap-pink">
                  Booking online hingga 20.00 WIB
                </span>
              </div>
            </div>

            {/* Primary Action Button (Calm 12px rounded rectangular button, NO large circles) */}
            <Link
              href="/booking"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-[12px] bg-ap-text text-ap-bg hover:bg-ap-pink hover:text-white font-meta-label text-sm uppercase font-bold tracking-widest shadow-xl transition-all active:scale-[0.98]"
            >
              <span>Pilih Jadwal Potong</span>
              <span className="text-base font-normal">↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Editorial Image Showcase */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative w-full aspect-[16/10] md:aspect-[21/9] overflow-hidden bg-ap-surface-lowest border border-ap-line shadow-xl">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxKJw8hiNXUwMp9d5MCWhY9hS3-AMFvb7SSHXntH5u4zHNouV9JjbQr_xdUuKWoH-Ne3zaM6AfvNh0mHCe-HC7DMRj7H8Vg47p2nkCr_1xLkEcas-JZUW8nylYHBUXULSiyp_22KtzCdmvUGOtd3UVo776-VdPt2RIJiRtLuE727jhiCdwQ7NViDrCzNC-mjfQv0OQ7nnHpHwouaIn1NXG3WLaA8H3BO6N3CiWJ7JwPew__Zkb7aQS"
              alt="Studio Aparatrambut Satu Kursi"
              className="w-full h-full object-cover grayscale contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none"></div>

            <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
              <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 border border-white/10">
                <span className="font-meta-code text-xs text-ap-pink uppercase tracking-widest">
                  KENAPA HARUS APARATRAMBUT?
                </span>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div className="bg-black/85 backdrop-blur-md p-4 max-w-md border border-white/10">
                <p className="font-headline-sm text-lg font-bold text-white tracking-tight">
                  Waktu khusus untuk potonganmu.
                </p>
                <p className="font-body-sm text-xs text-gray-300 mt-1">
                  Satu jadwal untuk satu orang. Tidak ada antrean berisik di ruang tunggu, kapster bekerja tenang dan teliti sampai rambutmu benar-benar rapi.
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-1 bg-black/85 backdrop-blur-md p-3 border border-white/10">
                <span className="font-meta-label text-[10px] uppercase text-gray-400">
                  Lokasi Studio
                </span>
                <span className="font-meta-code text-xs text-white">
                  Satu kursi, fokus untukmu
                </span>
                <span className="font-meta-time text-xs text-ap-pink">
                  Jl. Banjarsari Selatan No.88, Tembalang, Semarang
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services List Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto flex flex-col">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between pb-8 gap-4 border-b border-ap-line">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-ap-pink"></span>
              <span className="font-meta-label text-xs uppercase tracking-widest text-ap-text font-semibold">
                PILIHAN LAYANAN
              </span>
            </div>
            <Link
              href="/layanan"
              className="inline-flex items-center gap-1 font-meta-code text-xs text-ap-muted hover:text-ap-pink transition-colors"
            >
              <span>Lihat Detail Layanan</span>
              <span className="text-sm">↗</span>
            </Link>
          </div>

          <div className="flex flex-col divide-y divide-ap-line">
            {services.map((svc) => (
              <Link
                key={svc.id}
                href={`/booking?service=${svc.id}`}
                className="group flex flex-col md:flex-row md:items-center justify-between p-6 sm:p-8 bg-ap-surface hover:bg-ap-surface-high transition-all duration-200"
              >
                <div className="flex items-baseline gap-6 sm:gap-10">
                  <span className="font-meta-code text-lg sm:text-xl text-ap-pink font-semibold">
                    {svc.num}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-headline-md text-xl sm:text-2xl font-bold text-ap-text group-hover:text-ap-pink transition-colors">
                        {svc.name}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-ap-pink opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    </div>
                    <p className="font-body-sm text-xs sm:text-sm text-ap-muted mt-1 max-w-xl">
                      {svc.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-8 pt-4 md:pt-0">
                  <span className="font-meta-code text-xs text-ap-muted uppercase">
                    {svc.duration}
                  </span>
                  <span className="font-meta-time text-xl font-bold text-ap-text">
                    {svc.price}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-ap-surface-low border border-ap-line flex items-center justify-center text-ap-muted group-hover:bg-ap-pink group-hover:text-white group-hover:border-ap-pink transition-colors">
                    <span className="text-base">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy & Location Bento */}
      <section className="w-full px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Manifesto */}
          <div className="lg:col-span-5 bg-ap-surface-low border border-ap-line p-8 flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-ap-pink"></span>
                <span className="font-meta-label text-xs uppercase tracking-widest text-ap-text font-semibold">
                  STANDAR LAYANAN KAMI
                </span>
              </div>
              <p className="font-headline-sm text-xl sm:text-2xl text-ap-text font-bold leading-snug">
                Potong rambut yang teliti butuh waktu dan ketenangan.
              </p>
            </div>

            <div className="pt-8 flex flex-col gap-4">
              <p className="font-body-sm text-xs text-ap-muted leading-relaxed">
                Kami menjaga satu jadwal untuk satu orang agar setiap potongan mendapatkan waktu 60 menit yang cukup. Hasil potongan rapi, alat selalu disterilkan, dan pisau silet baru selalu diganti untuk tiap orang.
              </p>
              <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:gap-6 pt-4 border-t border-ap-line">
                <div className="flex flex-col">
                  <span className="font-meta-time text-xl sm:text-2xl text-ap-pink font-bold">11</span>
                  <span className="font-meta-code text-[10px] sm:text-[11px] text-ap-muted uppercase">Jadwal / Hari</span>
                </div>
                <div className="hidden sm:block w-px h-8 bg-ap-line"></div>
                <div className="flex flex-col">
                  <span className="font-meta-time text-xl sm:text-2xl text-ap-text font-bold">1</span>
                  <span className="font-meta-code text-[10px] sm:text-[11px] text-ap-muted uppercase">Tamu / Jam</span>
                </div>
                <div className="hidden sm:block w-px h-8 bg-ap-line"></div>
                <div className="flex flex-col">
                  <span className="font-meta-time text-xs sm:text-sm text-ap-text font-bold">Rp50.000</span>
                  <span className="font-meta-code text-[10px] sm:text-[11px] text-ap-muted uppercase">Tarif Bersih</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Location & Quick Prompt */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Location block */}
            <div className="bg-ap-surface-low border border-ap-line p-6 sm:p-8 flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4">
                <div>
                  <span className="font-meta-label text-xs text-ap-pink uppercase tracking-widest font-semibold">
                    LOKASI & AKSES
                  </span>
                  <h3 className="font-headline-sm text-xl font-bold text-ap-text mt-1">
                    Jl. Banjarsari Selatan No.88, Pedalangan, Kec. Tembalang
                  </h3>
                </div>
                <span className="self-start sm:self-auto font-meta-code text-xs text-ap-muted bg-ap-surface border border-ap-line px-3 py-1 shrink-0">
                  Kota Semarang
                </span>
              </div>

              <div className="p-4 bg-ap-surface border border-ap-line my-4 flex flex-col gap-2">
                <p className="font-body-sm text-xs text-ap-muted">
                  <strong className="text-ap-text">Petunjuk Kedatangan:</strong> Pinggir jalan utama Banjarsari Selatan, 3 menit dari gerbang Undip Tembalang. Parkir motor dan mobil aman tersedia tepat di depan studio.
                </p>
                <p className="font-meta-code text-[11px] text-ap-muted">
                  Buka setiap hari 10.00 – 21.00 WIB • Booking online terakhir pukul 20.00 WIB
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <Link
                  href="/alamat"
                  className="font-meta-code text-xs text-ap-muted hover:text-ap-text transition-colors"
                >
                  Detail Alamat Lengkap →
                </Link>
                <a
                  href="https://maps.google.com/?q=Jl.+Banjarsari+Selatan+No.88,+Pedalangan,+Kec.+Tembalang,+Kota+Semarang,+Jawa+Tengah+50275"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-meta-code text-xs text-ap-pink hover:underline inline-flex items-center gap-1 font-semibold"
                >
                  Buka Google Maps ↗
                </a>
              </div>
            </div>

            {/* Quick booking callout */}
            <div className="bg-ap-soft-pink border border-ap-pink/30 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex flex-col gap-1">
                <span className="font-meta-label text-xs uppercase tracking-widest text-ap-pink font-bold">
                  Booking Cepat
                </span>
                <p className="font-headline-sm text-lg font-bold text-ap-text">
                  Mau potong kapan? Amankan jam yang cocok sebelum slot hari ini penuh.
                </p>
              </div>
              <Link
                href="/booking"
                className="w-full sm:w-auto text-center px-6 py-3.5 bg-ap-pink hover:bg-ap-text text-white font-meta-label text-xs uppercase font-bold tracking-widest rounded-[12px] shrink-0 transition-colors shadow-lg"
              >
                Pilih Jam ↗
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
