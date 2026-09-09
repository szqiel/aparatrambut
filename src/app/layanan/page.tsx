import Link from 'next/link';

export default function LayananPage() {
  const services = [
    {
      id: 'svc-reguler',
      num: '01',
      name: 'Reguler Haircut',
      desc: 'Potongan rambut sesuai gaya yang kamu mau. Termasuk konsultasi bentuk rambut dan finishing yang rapi.',
      tags: ['Potongan sesuai kebutuhan', 'Finishing rapi', 'Peralatan steril'],
      duration: '60 Menit',
      price: 'Rp50.000',
    },
    {
      id: 'svc-shaving',
      num: '02',
      name: 'Haircut + Shaving',
      desc: 'Potongan rambut sekaligus merapikan jenggot dan kumis dengan handuk hangat dan pisau cukur steril.',
      tags: ['Handuk hangat', 'Cukur presisi', 'Aftershave soothing'],
      duration: '60 Menit',
      price: 'Rp50.000',
    },
    {
      id: 'svc-hairspa',
      num: '03',
      name: 'Haircut + Hair SPA',
      desc: 'Potongan rambut dengan perawatan tambahan untuk rambut dan kulit kepala disertai pijat relaksasi ringan.',
      tags: ['Tonic kulit kepala', 'Pijat relaksasi', 'Perawatan rambut'],
      duration: '60 Menit',
      price: 'Rp50.000',
    },
  ];

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      {/* Top Editorial Header */}
      <section className="pb-12 border-b border-ap-line">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-ap-pink">
              <span className="w-2 h-2 rounded-full bg-ap-pink"></span>
              <span className="font-meta-label text-xs uppercase tracking-widest text-ap-text font-bold">
                02 DAFTAR LAYANAN
              </span>
            </div>
            <div className="space-y-1 font-meta-code text-xs text-ap-muted">
              <p>PILIH LAYANAN</p>
              <p>Satu orang, satu jadwal</p>
              <p>Tiga pilihan, harga sama</p>
            </div>
          </div>

          <div className="md:col-span-8 flex flex-col">
            <h1 className="font-headline-lg text-3xl sm:text-5xl lg:text-6xl font-extrabold text-ap-text tracking-tight lowercase">
              Tiga layanan, harga sama.<br />
              <span className="text-ap-pink font-normal">Pilih yang paling cocok untukmu.</span>
            </h1>
            <p className="font-body-lg text-sm sm:text-base text-ap-muted mt-4 max-w-2xl leading-relaxed">
              Semua layanan berlangsung 60 menit dan dibayar setelah selesai di tempat. Tidak ada biaya tersembunyi.
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-12 flex flex-col divide-y divide-ap-line">
        {services.map((svc) => (
          <article
            key={svc.id}
            className="group py-12 transition-colors hover:bg-ap-surface/40 p-4 sm:p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Number */}
              <div className="md:col-span-2 flex items-center gap-3">
                <span className="font-meta-code text-3xl sm:text-4xl font-extrabold text-ap-muted group-hover:text-ap-pink transition-colors">
                  {svc.num}
                </span>
                <span className="w-2 h-2 rounded-full bg-ap-pink opacity-0 group-hover:opacity-100 transition-opacity"></span>
              </div>

              {/* Title & Description */}
              <div className="md:col-span-6 flex flex-col gap-3">
                <h2 className="font-headline-md text-2xl font-bold text-ap-text group-hover:text-ap-pink transition-colors">
                  {svc.name}
                </h2>
                <p className="font-body-md text-sm text-ap-muted leading-relaxed max-w-xl">
                  {svc.desc}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {svc.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-ap-surface-low border border-ap-line font-meta-code text-[11px] text-ap-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pricing & Duration */}
              <div className="md:col-span-2 flex flex-col justify-start md:text-right">
                <span className="font-meta-code text-xs uppercase tracking-wider text-ap-muted">
                  Harga & Durasi
                </span>
                <span className="font-meta-time text-2xl font-bold text-ap-text mt-1">
                  {svc.price}
                </span>
                <span className="font-meta-code text-xs text-ap-pink font-medium">
                  {svc.duration}
                </span>
              </div>

              {/* Action */}
              <div className="md:col-span-2 flex items-center md:justify-end pt-2 md:pt-0">
                <Link
                  href={`/booking?service=${svc.id}`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-[12px] bg-ap-surface-low border border-ap-line text-ap-text group-hover:bg-ap-pink group-hover:text-white group-hover:border-ap-pink font-meta-label text-xs uppercase font-bold tracking-wider transition-all"
                >
                  <span>Pilih Layanan</span>
                  <span className="text-sm">→</span>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Note on Transparency */}
      <section className="p-6 sm:p-8 bg-ap-surface-low border border-ap-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex flex-col gap-1 max-w-xl">
          <span className="font-meta-label text-xs uppercase tracking-widest text-ap-pink font-semibold">
            Pembayaran di Tempat
          </span>
          <p className="font-body-sm text-sm text-ap-muted">
            Pembayaran dilakukan setelah potongan selesai dengan QRIS atau tunai pas. Tidak perlu pembayaran di muka.
          </p>
        </div>
        <Link
          href="/booking"
          className="px-6 py-3 bg-ap-text text-ap-bg hover:bg-ap-pink hover:text-white rounded-[12px] font-meta-label text-xs uppercase font-bold tracking-widest transition-colors shrink-0"
        >
          Lihat Jadwal Kosong ↗
        </Link>
      </section>
    </div>
  );
}
