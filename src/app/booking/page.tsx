'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useBookingRepository } from '../../lib/repository/use-booking-repository';
import { Service, SlotAvailability } from '../../lib/types';
import {
  calculateEndTime,
  formatIndonesianDate,
  getDateRelativeBadge,
  getJakartaTodayString,
  getUpcomingDays,
} from '../../lib/time';

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialServiceId = searchParams.get('service') || 'svc-reguler';

  const { repository, version } = useBookingRepository();

  const [services, setServices] = useState<Service[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialServiceId);

  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [holidayDates, setHolidayDates] = useState<Set<string>>(new Set());

  const [slots, setSlots] = useState<SlotAvailability[]>([]);
  const [selectedSlotTime, setSelectedSlotTime] = useState<string>('');

  const [visitorName, setVisitorName] = useState<string>('');
  const [whatsapp, setWhatsapp] = useState<string>('');
  const [note, setNote] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 1. Load Services & Initialize Dates
  useEffect(() => {
    async function init() {
      const svcs = await repository.getServices();
      setServices(svcs);
      if (svcs.length > 0) {
        setSelectedServiceId((prev) => (svcs.some((s) => s.id === prev) ? prev : svcs[0].id));
      }

      const upcoming = getUpcomingDays(7);
      setDates(upcoming);

      // Check holidays for the days
      const holidays = await repository.getHolidays();
      const holSet = new Set(holidays.map((h) => h.date));
      setHolidayDates(holSet);

      // Default selected date to first non-holiday day
      const firstAvailableDate = upcoming.find((d) => !holSet.has(d)) || upcoming[0];
      setSelectedDate(firstAvailableDate);
    }
    init();
  }, [repository, version]);

  // 2. Load Slot Availability when selectedDate changes or repository updates
  useEffect(() => {
    async function loadSlots() {
      if (!selectedDate) return;
      const daySlots = await repository.getAvailableSlots(selectedDate);
      setSlots(daySlots);

      // If currently selected slot is now unavailable, reset selection
      if (selectedSlotTime) {
        const matching = daySlots.find((s) => s.startTime === selectedSlotTime);
        if (!matching || !matching.isAvailable) {
          setSelectedSlotTime('');
        }
      }
    }
    loadSlots();
  }, [selectedDate, repository, version, selectedSlotTime]);

  const selectedService = services.find((s) => s.id === selectedServiceId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedService) {
      setErrorMessage('Pilih salah satu layanan.');
      return;
    }
    if (!selectedDate) {
      setErrorMessage('Pilih tanggal kunjungan.');
      return;
    }
    if (!selectedSlotTime) {
      setErrorMessage('Pilih jam operasional yang tersedia.');
      return;
    }
    if (!visitorName.trim()) {
      setErrorMessage('Nama orang yang datang wajib diisi.');
      return;
    }
    if (!whatsapp.trim()) {
      setErrorMessage('Nomor WhatsApp wajib diisi untuk penerimaan tiket.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await repository.createBooking({
        serviceId: selectedService.id,
        date: selectedDate,
        startTime: selectedSlotTime,
        visitorName: visitorName.trim(),
        whatsapp: whatsapp.trim(),
        note: note.trim() || undefined,
      });

      if (!result.success || !result.booking) {
        setErrorMessage(result.error || 'Terjadi kesalahan saat memproses booking.');
        setIsSubmitting(false);
        return;
      }

      // Navigate to private digital ticket
      router.push(`/tiket/${result.booking.ticketToken}`);
    } catch {
      setErrorMessage('Terjadi kendala jaringan atau sistem. Silakan coba kembali.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Progress Header Ribbon */}
      <section className="w-full bg-ap-surface-low border-b border-ap-line px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-ap-pink animate-pulse"></span>
            <span className="font-meta-label text-xs uppercase tracking-widest text-ap-muted">
              Alur Reservasi
            </span>
          </div>

          <nav aria-label="Tahapan reservasi" className="flex items-center gap-4 font-meta-code text-xs text-ap-muted">
            <div className={`flex items-center gap-1.5 ${selectedService ? 'text-ap-text font-bold' : ''}`}>
              <span className="text-ap-pink">•</span>
              <span>01. Layanan</span>
            </div>
            <span>/</span>
            <div className={`flex items-center gap-1.5 ${selectedSlotTime ? 'text-ap-text font-bold' : ''}`}>
              <span className={selectedSlotTime ? 'text-ap-pink' : ''}>•</span>
              <span>02. Tanggal & Jam</span>
            </div>
            <span>/</span>
            <div className={`flex items-center gap-1.5 ${visitorName && whatsapp ? 'text-ap-text font-bold' : ''}`}>
              <span>•</span>
              <span>03. Data Diri</span>
            </div>
          </nav>
        </div>
      </section>

      {/* Main Booking Canvas */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Form Column (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            <div>
              <div className="inline-flex items-center gap-2 text-ap-pink font-meta-code text-xs">
                <span>Pilih Jam & Data</span>
                <span className="h-px w-12 bg-ap-line"></span>
              </div>
              <h1 className="font-headline-lg text-3xl sm:text-4xl font-extrabold text-ap-text tracking-tight mt-1">
                Pilih waktu yang cocok.
              </h1>
              <p className="font-body-md text-sm text-ap-muted mt-2 max-w-xl">
                Satu slot hanya untuk satu orang. Waktumu tidak akan bertabrakan dengan antrean tamu lain.
              </p>
            </div>

            {/* Step 1: Select Service */}
            <div className="bg-ap-surface-low border border-ap-line p-6 sm:p-8 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-ap-line">
                <span className="font-meta-label text-xs uppercase tracking-widest text-ap-text font-bold">
                  1. Pilih Layanan (Semua 60 Menit • Rp50.000)
                </span>
                <span className="font-meta-code text-xs text-ap-pink">
                  Rp50.000
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {services.map((svc) => {
                  const isSelected = selectedServiceId === svc.id;
                  return (
                    <button
                      key={svc.id}
                      type="button"
                      onClick={() => setSelectedServiceId(svc.id)}
                      className={`p-4 border text-left flex flex-col justify-between gap-3 transition-all rounded-[12px] ${
                        isSelected
                          ? 'border-ap-pink bg-ap-surface ring-1 ring-ap-pink'
                          : 'border-ap-line bg-ap-surface hover:border-ap-text/40'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-headline-sm text-sm font-bold text-ap-text">
                          {svc.name}
                        </span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-ap-pink"></span>
                        )}
                      </div>
                      <p className="font-body-sm text-xs text-ap-muted line-clamp-2">
                        {svc.description}
                      </p>
                      <div className="flex items-center justify-between font-meta-code text-[11px] text-ap-muted pt-2 border-t border-ap-line/40">
                        <span>60 Menit</span>
                        <span className="text-ap-text font-bold">Rp50.000</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Date Selector */}
            <div className="bg-ap-surface-low border border-ap-line p-6 sm:p-8 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-ap-line">
                <span className="font-meta-label text-xs uppercase tracking-widest text-ap-text font-bold">
                  2. Pilih Tanggal
                </span>
                <span className="font-meta-code text-xs text-ap-muted">
                  {selectedDate ? formatIndonesianDate(selectedDate, { includeYear: true }) : 'Pilih tanggal'}
                </span>
              </div>

              {/* Date Scroll Pills */}
              <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar">
                {dates.map((dStr) => {
                  const isSelected = selectedDate === dStr;
                  const isHoliday = holidayDates.has(dStr);
                  const badge = isHoliday ? 'Studio Libur' : getDateRelativeBadge(dStr);
                  const dayNum = dStr.split('-')[2];
                  const dayName = formatIndonesianDate(dStr, { shortMonth: true }).split(',')[0];

                  return (
                    <button
                      key={dStr}
                      type="button"
                      disabled={isHoliday}
                      onClick={() => {
                        setSelectedDate(dStr);
                        setSelectedSlotTime('');
                      }}
                      className={`flex-shrink-0 flex flex-col items-center justify-center w-24 py-3 px-2 border rounded-[12px] transition-all ${
                        isHoliday
                          ? 'border-ap-line bg-ap-surface-high opacity-50 cursor-not-allowed text-ap-muted'
                          : isSelected
                          ? 'border-ap-pink bg-ap-pink text-white shadow-lg font-bold'
                          : 'border-ap-line bg-ap-surface text-ap-muted hover:border-ap-text/40 hover:text-ap-text'
                      }`}
                    >
                      <span className={`font-meta-label text-[10px] uppercase ${isSelected ? 'text-white' : ''}`}>
                        {badge}
                      </span>
                      <span className={`font-meta-time text-lg font-bold mt-1 ${isHoliday ? 'line-through' : ''}`}>
                        {dayNum}
                      </span>
                      <span className="font-meta-code text-[10px] uppercase mt-1">
                        {dayName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Time Slot Grid */}
            <div className="bg-ap-surface-low border border-ap-line p-6 sm:p-8 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-ap-line">
                <span className="font-meta-label text-xs uppercase tracking-widest text-ap-text font-bold">
                  3. Pilih Jam Operasional (1 Sesi = 60 Menit)
                </span>
                <div className="flex items-center gap-3 font-meta-code text-[11px] text-ap-muted">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 bg-ap-pink rounded-full"></span> Terpilih
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 border border-ap-line bg-ap-surface rounded-full"></span> Kosong
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 bg-ap-line rounded-full"></span> Terisi
                  </span>
                </div>
              </div>

              {holidayDates.has(selectedDate) ? (
                <div className="p-8 text-center text-ap-muted font-meta-code text-xs bg-ap-surface border border-ap-line">
                  Studio tutup pada tanggal ini (Hari Libur). Silakan pilih tanggal lain.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
                  {slots.map((slot) => {
                    const isSelected = selectedSlotTime === slot.startTime;
                    const isAvailable = slot.isAvailable;

                    return (
                      <button
                        key={slot.startTime}
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => setSelectedSlotTime(slot.startTime)}
                        className={`p-3.5 border rounded-[12px] text-left flex flex-col justify-between transition-all ${
                          !isAvailable
                            ? 'bg-ap-surface-lowest/50 border-ap-line opacity-45 cursor-not-allowed text-ap-muted'
                            : isSelected
                            ? 'border-ap-pink bg-ap-surface ring-2 ring-ap-pink shadow-md'
                            : 'border-ap-line bg-ap-surface hover:border-ap-text/40'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span
                            className={`font-meta-time text-base font-bold ${
                              isSelected ? 'text-ap-pink' : 'text-ap-text'
                            } ${!isAvailable ? 'line-through' : ''}`}
                          >
                            {slot.startTime}
                          </span>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-ap-pink"></span>
                          )}
                        </div>
                        <span className="font-meta-code text-[11px] text-ap-muted mt-2">
                          {slot.status === 'AVAILABLE'
                            ? 'Tersedia'
                            : slot.status === 'PAST'
                            ? 'Sudah lewat'
                            : 'Terisi'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Step 4: Contact Form */}
            <form onSubmit={handleSubmit} className="bg-ap-surface-low border border-ap-line p-6 sm:p-8 flex flex-col gap-6">
              <div className="flex items-center justify-between pb-2 border-b border-ap-line">
                <span className="font-meta-label text-xs uppercase tracking-widest text-ap-text font-bold">
                  4. Data Orang yang Datang
                </span>
                <span className="font-meta-code text-xs text-ap-pink">
                  Untuk Penerbitan Tiket
                </span>
              </div>

              <div className="p-3 bg-ap-soft-pink border border-ap-pink/30 text-xs font-meta-code text-ap-text">
                ℹ <strong>Penting:</strong> Nama di bawah adalah orang yang akan datang dicukur. Nomor WhatsApp boleh milik pemesan untuk menerima tiket digital.
              </div>

              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="visitorName" className="font-meta-label text-xs uppercase tracking-wider text-ap-muted font-bold">
                  Nama Lengkap Pengunjung <span className="text-ap-pink">*</span>
                </label>
                <input
                  id="visitorName"
                  type="text"
                  required
                  placeholder="e.g. Raditya Pratama"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full bg-ap-surface border border-ap-line px-4 py-3 text-sm text-ap-text placeholder-ap-muted focus:outline-none focus:border-ap-pink transition-colors rounded-[12px]"
                />
              </div>

              {/* WhatsApp Number */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="whatsapp" className="font-meta-label text-xs uppercase tracking-wider text-ap-muted font-bold">
                  Nomor WhatsApp <span className="text-ap-pink">*</span>
                </label>
                <input
                  id="whatsapp"
                  type="tel"
                  required
                  placeholder="0812-xxxx-xxxx"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full bg-ap-surface border border-ap-line px-4 py-3 font-meta-time text-sm text-ap-text placeholder-ap-muted focus:outline-none focus:border-ap-pink transition-colors rounded-[12px]"
                />
                <span className="font-meta-code text-[11px] text-ap-muted">
                  Satu nomor hanya dapat memiliki 1 booking aktif yang belum selesai.
                </span>
              </div>

              {/* Optional Note */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="note" className="font-meta-label text-xs uppercase tracking-wider text-ap-muted font-bold">
                    Catatan Tambahan / Preferensi Potong
                  </label>
                  <span className="font-meta-code text-[11px] text-ap-muted">Opsional</span>
                </div>
                <textarea
                  id="note"
                  rows={3}
                  placeholder="Misal: Taper fade tipis samping, jangan potong bagian atas terlalu pendek."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-ap-surface border border-ap-line p-4 text-xs text-ap-text placeholder-ap-muted focus:outline-none focus:border-ap-pink transition-colors rounded-[12px] resize-none"
                />
              </div>

              {errorMessage && (
                <div className="p-4 bg-ap-error-container text-ap-error border border-ap-error/40 font-meta-code text-xs rounded-[12px]">
                  ⚠️ {errorMessage}
                </div>
              )}
            </form>
          </div>

          {/* Right Summary Column (4 cols, Sticky) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 flex flex-col gap-6">
            <div className="bg-ap-surface-low border border-ap-line p-6 sm:p-8 flex flex-col gap-6 shadow-xl rounded-[12px]">
              <div className="flex items-center justify-between pb-3 border-b border-ap-line">
                <div className="flex flex-col">
                  <span className="font-meta-label text-[10px] uppercase text-ap-pink tracking-widest font-bold">
                    TIKET DIGITAL
                  </span>
                  <h2 className="font-headline-sm text-lg font-bold text-ap-text">
                    Ringkasan Booking
                  </h2>
                </div>
                <div className="w-7 h-7 rounded-full bg-ap-soft-pink text-ap-pink flex items-center justify-center font-meta-code text-xs font-bold">
                  #
                </div>
              </div>

              <div className="flex flex-col gap-3 font-body-sm text-xs">
                {/* Service */}
                <div className="flex items-start justify-between py-1 border-b border-ap-line/40">
                  <div className="flex flex-col">
                    <span className="font-meta-label text-[10px] uppercase text-ap-muted">Layanan</span>
                    <span className="font-headline-sm text-sm font-bold text-ap-text">
                      {selectedService?.name || 'Belum dipilih'}
                    </span>
                    <span className="font-meta-code text-[11px] text-ap-pink">
                      Durasi: 60 Menit
                    </span>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-start justify-between py-1 border-b border-ap-line/40">
                  <div className="flex flex-col">
                    <span className="font-meta-label text-[10px] uppercase text-ap-muted">Tanggal</span>
                    <span className="font-meta-time text-xs font-bold text-ap-text">
                      {selectedDate ? formatIndonesianDate(selectedDate, { includeYear: true }) : 'Pilih tanggal'}
                    </span>
                  </div>
                  <span className="font-meta-code text-xs text-ap-muted">TGL</span>
                </div>

                {/* Time */}
                <div className="flex items-start justify-between py-1 border-b border-ap-line/40">
                  <div className="flex flex-col">
                    <span className="font-meta-label text-[10px] uppercase text-ap-muted">Alokasi Waktu</span>
                    <span className="font-meta-time text-xs font-bold text-ap-pink">
                      {selectedSlotTime
                        ? `${selectedSlotTime} – ${calculateEndTime(selectedSlotTime)} WIB`
                        : 'Pilih jam'}
                    </span>
                  </div>
                  <span className="font-meta-code text-xs text-ap-muted">Jam</span>
                </div>

                {/* Barber Chair */}
                <div className="flex items-start justify-between py-1 border-b border-ap-line/40">
                  <div className="flex flex-col">
                    <span className="font-meta-label text-[10px] uppercase text-ap-muted">Kapasitas</span>
                    <span className="text-xs font-semibold text-ap-text">Satu Kursi (Personal)</span>
                  </div>
                  <span className="font-meta-code text-xs text-ap-muted">Solo</span>
                </div>

                {/* Location */}
                <div className="flex items-start justify-between py-1">
                  <div className="flex flex-col">
                    <span className="font-meta-label text-[10px] uppercase text-ap-muted">Lokasi</span>
                    <span className="text-xs font-medium text-ap-text">[Alamat studio], [Kota]</span>
                  </div>
                </div>
              </div>

              {/* Total & Payment Method */}
              <div className="p-4 bg-ap-surface border border-ap-line flex flex-col gap-1 rounded-[12px]">
                <div className="flex items-baseline justify-between">
                  <span className="font-meta-label text-xs uppercase tracking-wider text-ap-muted">
                    Total
                  </span>
                  <span className="font-headline-md text-2xl font-extrabold text-ap-text tracking-tight">
                    Rp50.000
                  </span>
                </div>
                <p className="font-meta-code text-[11px] text-ap-muted pt-1 border-t border-ap-line/40">
                  Bayar di tempat: QRIS / Tunai pas
                </p>
              </div>

              {/* Lateness Help Box */}
              <div className="p-3 bg-ap-surface border border-ap-line text-xs flex items-start gap-2 rounded-[12px]">
                <span className="text-ap-pink font-bold">ℹ</span>
                <p className="font-body-sm text-[11px] text-ap-muted leading-tight">
                  Jika terlambat, kabari admin via WhatsApp agar booking-mu dapat dikoordinasikan.
                </p>
              </div>

              {/* Confirm Booking CTA */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !selectedSlotTime || !visitorName || !whatsapp}
                className="w-full py-4 px-6 rounded-[12px] bg-ap-pink hover:bg-ap-text text-white font-meta-label text-sm uppercase font-bold tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                <span>{isSubmitting ? 'Memproses Booking...' : 'Kunci Booking'}</span>
                <span className="text-base">↗</span>
              </button>

              <p className="text-center font-meta-code text-[10px] text-ap-muted">
                Tiket digital privat akan langsung diterbitkan setelah booking dikonfirmasi.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center font-meta-code text-xs text-ap-muted">Memuat halaman booking...</div>}>
      <BookingContent />
    </Suspense>
  );
}
