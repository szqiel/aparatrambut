'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useBookingRepository } from '../../lib/repository/use-booking-repository';
import { Booking, BookingStatus, Service, SlotAvailability } from '../../lib/types';
import {
  calculateEndTime,
  formatIndonesianDate,
  getAllStandardSlots,
  getJakartaCurrentTimeString,
  getJakartaTodayString,
  getUpcomingDays,
} from '../../lib/time';
import { Modal } from '../../components/Modal';

export default function AdminAgendaPage() {
  const { repository, version } = useBookingRepository();

  const [currentDate, setCurrentDate] = useState<string>('');
  const [timeStr, setTimeStr] = useState<string>('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isHoliday, setIsHoliday] = useState<boolean>(false);
  const [slots, setSlots] = useState<SlotAvailability[]>([]);

  // Walk-in modal state
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);
  const [walkInTime, setWalkInTime] = useState('10:00');
  const [walkInServiceId, setWalkInServiceId] = useState('');
  const [walkInVisitorName, setWalkInVisitorName] = useState('');
  const [walkInWhatsapp, setWalkInWhatsapp] = useState('');
  const [walkInNote, setWalkInNote] = useState('');
  const [walkInError, setWalkInError] = useState('');
  const [isSubmittingWalkIn, setIsSubmittingWalkIn] = useState(false);

  // Initialize date & timer
  useEffect(() => {
    const today = getJakartaTodayString();
    setCurrentDate(today);

    const updateClock = () => {
      setTimeStr(getJakartaCurrentTimeString());
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load bookings and services for the date
  useEffect(() => {
    async function loadData() {
      if (!currentDate) return;

      const [svcs, dayBookings, holStatus, daySlots] = await Promise.all([
        repository.getServices(),
        repository.getBookingsForDate(currentDate),
        repository.isHoliday(currentDate),
        repository.getAvailableSlots(currentDate),
      ]);

      setServices(svcs);
      if (svcs.length > 0 && !walkInServiceId) {
        setWalkInServiceId(svcs[0].id);
      }
      setBookings(dayBookings);
      setIsHoliday(holStatus);
      setSlots(daySlots);
    }
    loadData();
  }, [currentDate, repository, version, walkInServiceId]);

  const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
    await repository.updateBookingStatus(id, newStatus);
  };

  const handleOpenWalkIn = (initialTime?: string) => {
    setWalkInError('');
    setWalkInVisitorName('');
    setWalkInWhatsapp('');
    setWalkInNote('');
    if (initialTime) setWalkInTime(initialTime);
    setIsWalkInModalOpen(true);
  };

  const handleSubmitWalkIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setWalkInError('');

    if (!walkInVisitorName.trim()) {
      setWalkInError('Nama pengunjung wajib diisi.');
      return;
    }
    if (!walkInServiceId) {
      setWalkInError('Pilih layanan.');
      return;
    }

    setIsSubmittingWalkIn(true);
    try {
      const res = await repository.addWalkIn({
        serviceId: walkInServiceId,
        date: currentDate,
        startTime: walkInTime,
        visitorName: walkInVisitorName.trim(),
        whatsapp: walkInWhatsapp.trim() || undefined,
        note: walkInNote.trim() || undefined,
      });

      if (!res.success) {
        setWalkInError(res.error || 'Gagal menambahkan walk-in.');
        setIsSubmittingWalkIn(false);
        return;
      }

      setIsWalkInModalOpen(false);
    } catch {
      setWalkInError('Terjadi kesalahan.');
    } finally {
      setIsSubmittingWalkIn(false);
    }
  };

  // Metrics
  const bookedCount = bookings.filter((b) => b.status === 'BOOKED').length;
  const walkInCount = bookings.filter((b) => b.status === 'WALK_IN').length;
  const completedCount = bookings.filter((b) => b.status === 'COMPLETED').length;
  const standardSlots = getAllStandardSlots();
  const availableCount = isHoliday
    ? 0
    : standardSlots.filter(
        (s) => !bookings.some((b) => b.startTime === s.startTime && (b.status === 'BOOKED' || b.status === 'WALK_IN'))
      ).length;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Top Header Controls */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-ap-line">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2 font-meta-code text-xs text-ap-muted">
            <span className="inline-flex items-center gap-1.5 text-ap-pink uppercase font-semibold">
              <span className="w-2 h-2 rounded-full bg-ap-pink animate-pulse"></span>
              Live Shift Aktif
            </span>
            <span>/</span>
            <span>Kursi 01 (Master)</span>
            <span>/</span>
            <span className="text-ap-text">WIB {timeStr}</span>
          </div>

          <div className="flex flex-wrap items-baseline gap-4 mt-1">
            <h1 className="font-headline-md text-3xl font-extrabold text-ap-text tracking-tight">
              Agenda Hari Ini
            </h1>
            <div className="flex items-center gap-2 px-3 py-1 bg-ap-surface border border-ap-line text-xs font-meta-code text-ap-text rounded-[12px]">
              <span className="text-ap-pink font-bold">
                {currentDate ? formatIndonesianDate(currentDate) : ''}
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-4 font-meta-code text-xs pt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-ap-pink rounded-full"></span>
              <span className="text-ap-text font-bold">{bookedCount + walkInCount}</span>
              <span className="text-ap-muted uppercase">Terisi</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 border border-ap-line bg-ap-surface rounded-full"></span>
              <span className="text-ap-text font-bold">{availableCount}</span>
              <span className="text-ap-muted uppercase">Kosong</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-ap-text font-bold">{completedCount}</span>
              <span className="text-ap-muted uppercase">Selesai</span>
            </div>
            {isHoliday && (
              <>
                <span>•</span>
                <span className="px-2 py-0.5 bg-ap-error-container text-ap-error font-bold rounded-sm">
                  STUDIO LIBUR HARI INI
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2.5 font-meta-label text-xs uppercase font-bold">
          <button
            type="button"
            onClick={() => handleOpenWalkIn()}
            className="px-4 py-2.5 rounded-[12px] bg-ap-pink hover:bg-ap-text text-white transition-colors flex items-center gap-1.5 shadow-md"
          >
            <span>+</span>
            <span>Walk-In Baru</span>
          </button>
          <Link
            href="/admin/holidays"
            className="px-4 py-2.5 rounded-[12px] bg-ap-surface-low border border-ap-line hover:border-ap-text/40 text-ap-text transition-colors"
          >
            Hari Libur
          </Link>
          <Link
            href="/admin/settings"
            className="px-4 py-2.5 rounded-[12px] bg-ap-surface-low border border-ap-line hover:border-ap-text/40 text-ap-muted hover:text-ap-text transition-colors"
          >
            Pengaturan Studio
          </Link>
        </div>
      </section>

      {/* Date Switcher Tabs (For inspecting tomorrow or past days) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {getUpcomingDays(5).map((dStr) => {
          const isSelected = currentDate === dStr;
          return (
            <button
              key={dStr}
              onClick={() => setCurrentDate(dStr)}
              className={`px-3 py-1.5 rounded-[12px] text-xs font-meta-code whitespace-nowrap border transition-all ${
                isSelected
                  ? 'bg-ap-text text-ap-bg border-ap-text font-bold'
                  : 'bg-ap-surface border-ap-line text-ap-muted hover:text-ap-text'
              }`}
            >
              {formatIndonesianDate(dStr, { shortMonth: true })}
            </button>
          );
        })}
      </div>

      {/* Agenda Chronological Grid */}
      <div className="w-full bg-ap-surface-low border border-ap-line rounded-[12px] overflow-hidden shadow-xl">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 px-6 py-3 border-b border-ap-line font-meta-label text-[11px] uppercase tracking-wider text-ap-muted">
          <div className="col-span-2">Waktu (WIB)</div>
          <div className="col-span-4">Pelanggan & Layanan</div>
          <div className="col-span-2">Tarif</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-2 text-right">Aksi Cepat</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-ap-line">
          {standardSlots.map(({ startTime, endTime }) => {
            const booking = bookings.find(
              (b) => b.startTime === startTime && (b.status === 'BOOKED' || b.status === 'WALK_IN')
            );
            const pastOrOtherBooking = bookings.find(
              (b) => b.startTime === startTime && (b.status === 'COMPLETED' || b.status === 'CANCELLED' || b.status === 'NO_SHOW')
            );
            const activeOrResolved = booking || pastOrOtherBooking;

            return (
              <div
                key={startTime}
                className={`p-4 sm:p-6 transition-colors flex flex-col md:grid md:grid-cols-12 gap-4 items-start md:items-center ${
                  activeOrResolved ? 'bg-ap-surface' : 'bg-ap-surface-low hover:bg-ap-surface/40'
                }`}
              >
                {/* Column 1: Time */}
                <div className="col-span-2 flex items-center gap-2 font-meta-time text-sm font-bold text-ap-text">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      booking ? 'bg-ap-pink' : 'border border-ap-line'
                    }`}
                  ></span>
                  <span>{startTime}</span>
                  <span className="text-ap-muted text-xs font-normal">→ {endTime}</span>
                </div>

                {/* Column 2: Customer & Service */}
                <div className="col-span-4 flex flex-col gap-1 w-full">
                  {activeOrResolved ? (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="font-headline-sm text-base font-bold text-ap-text">
                          {activeOrResolved.visitorName}
                        </span>
                        {activeOrResolved.status === 'WALK_IN' && (
                          <span className="px-1.5 py-0.5 bg-ap-soft-pink text-ap-pink text-[10px] font-meta-code uppercase font-bold rounded-sm">
                            Walk-In
                          </span>
                        )}
                      </div>
                      <p className="font-body-sm text-xs text-ap-muted">
                        {activeOrResolved.serviceName} • {activeOrResolved.phoneNormalized}
                      </p>
                      {activeOrResolved.note && (
                        <p className="font-meta-code text-[11px] text-ap-muted italic line-clamp-1">
                          &ldquo;{activeOrResolved.note}&rdquo;
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col">
                      <span className="font-body-md text-sm text-ap-muted italic">
                        {isHoliday ? 'Studio Libur' : 'Slot Kosong'}
                      </span>
                      <span className="font-meta-code text-[11px] text-ap-muted">
                        {isHoliday ? 'Tanggal ditandai libur' : 'Siap untuk walk-in atau booking'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Column 3: Tariff */}
                <div className="col-span-2 font-meta-code text-xs text-ap-muted">
                  {activeOrResolved ? (
                    <div>
                      <span className="text-ap-text font-bold">Rp50.000</span>
                      <p className="text-[10px] text-ap-muted">Bayar di Tempat</p>
                    </div>
                  ) : (
                    <span>—</span>
                  )}
                </div>

                {/* Column 4: Status */}
                <div className="col-span-2 flex justify-start md:justify-center">
                  {activeOrResolved ? (
                    <span
                      className={`px-2.5 py-1 text-[11px] font-meta-code font-bold uppercase rounded-[12px] border ${
                        activeOrResolved.status === 'BOOKED'
                          ? 'bg-ap-soft-pink border-ap-pink/40 text-ap-pink'
                          : activeOrResolved.status === 'WALK_IN'
                          ? 'bg-ap-soft-pink border-ap-pink/40 text-ap-pink'
                          : activeOrResolved.status === 'COMPLETED'
                          ? 'bg-green-500/10 border-green-500/40 text-green-500'
                          : activeOrResolved.status === 'NO_SHOW'
                          ? 'bg-ap-error-container border-ap-error/40 text-ap-error'
                          : 'bg-ap-surface-high border-ap-line text-ap-muted line-through'
                      }`}
                    >
                      {activeOrResolved.status}
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 text-[11px] font-meta-code text-ap-muted uppercase border border-ap-line rounded-[12px]">
                      {isHoliday ? 'Tutup' : 'Tersedia'}
                    </span>
                  )}
                </div>

                {/* Column 5: Actions */}
                <div className="col-span-2 flex flex-wrap items-center justify-end gap-1.5 w-full">
                  {activeOrResolved ? (
                    <>
                      {activeOrResolved.status === 'BOOKED' || activeOrResolved.status === 'WALK_IN' ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(activeOrResolved.id, 'COMPLETED')}
                            className="px-2.5 py-1 rounded-[12px] bg-ap-text text-ap-bg hover:bg-ap-pink hover:text-white font-meta-code text-xs uppercase font-bold transition-colors"
                            title="Tandai Selesai"
                          >
                            Selesai
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(activeOrResolved.id, 'NO_SHOW')}
                            className="px-2.5 py-1 rounded-[12px] border border-ap-line hover:border-ap-error hover:text-ap-error text-ap-muted font-meta-code text-xs uppercase transition-colors"
                            title="Tandai Tidak Hadir (Manual)"
                          >
                            No-Show
                          </button>
                        </>
                      ) : null}
                      <Link
                        href={`/admin/booking/${activeOrResolved.id}`}
                        className="px-2.5 py-1 rounded-[12px] border border-ap-line hover:border-ap-text/40 text-ap-text font-meta-code text-xs uppercase transition-colors"
                      >
                        Detail
                      </Link>
                    </>
                  ) : (
                    !isHoliday && (
                      <button
                        type="button"
                        onClick={() => handleOpenWalkIn(startTime)}
                        className="px-3 py-1 rounded-[12px] bg-ap-surface border border-ap-line text-ap-pink hover:bg-ap-pink hover:text-white font-meta-code text-xs uppercase font-semibold transition-colors"
                      >
                        + Walk-In
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Walk-In Modal */}
      <Modal
        isOpen={isWalkInModalOpen}
        onClose={() => setIsWalkInModalOpen(false)}
        title="+ Tambah Walk-In Baru"
      >
        <form onSubmit={handleSubmitWalkIn} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-meta-label text-xs uppercase text-ap-muted font-bold">
              Jam Sesi
            </label>
            <select
              value={walkInTime}
              onChange={(e) => setWalkInTime(e.target.value)}
              className="bg-ap-surface border border-ap-line px-3 py-2 text-sm text-ap-text rounded-[12px] focus:outline-none"
            >
              {standardSlots.map((s) => (
                <option key={s.startTime} value={s.startTime}>
                  {s.startTime} — {s.endTime} WIB
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-meta-label text-xs uppercase text-ap-muted font-bold">
              Pilih Layanan
            </label>
            <select
              value={walkInServiceId}
              onChange={(e) => setWalkInServiceId(e.target.value)}
              className="bg-ap-surface border border-ap-line px-3 py-2 text-sm text-ap-text rounded-[12px] focus:outline-none"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (60 Menit • Rp50.000)
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-meta-label text-xs uppercase text-ap-muted font-bold">
              Nama Tamu Walk-In *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Budi Santoso"
              value={walkInVisitorName}
              onChange={(e) => setVisitorNameLocal(e.target.value)}
              className="bg-ap-surface border border-ap-line px-3 py-2 text-sm text-ap-text rounded-[12px] focus:outline-none focus:border-ap-pink"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-meta-label text-xs uppercase text-ap-muted font-bold">
              Nomor WhatsApp (Opsional)
            </label>
            <input
              type="tel"
              placeholder="0812-xxxx-xxxx"
              value={walkInWhatsapp}
              onChange={(e) => setWalkInWhatsapp(e.target.value)}
              className="bg-ap-surface border border-ap-line px-3 py-2 text-sm text-ap-text rounded-[12px] focus:outline-none focus:border-ap-pink font-meta-time"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-meta-label text-xs uppercase text-ap-muted font-bold">
              Catatan Permintaan (Opsional)
            </label>
            <textarea
              rows={2}
              placeholder="Misal: Langsung potong pendek."
              value={walkInNote}
              onChange={(e) => setWalkInNote(e.target.value)}
              className="bg-ap-surface border border-ap-line p-3 text-xs text-ap-text rounded-[12px] focus:outline-none focus:border-ap-pink resize-none"
            />
          </div>

          {walkInError && (
            <div className="p-3 bg-ap-error-container text-ap-error font-meta-code text-xs rounded-[12px]">
              ⚠️ {walkInError}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-ap-line">
            <button
              type="button"
              onClick={() => setIsWalkInModalOpen(false)}
              className="px-4 py-2 rounded-[12px] border border-ap-line text-xs font-meta-code text-ap-text"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmittingWalkIn}
              className="px-5 py-2 rounded-[12px] bg-ap-pink hover:bg-ap-text text-white text-xs font-meta-code font-bold uppercase transition-colors"
            >
              {isSubmittingWalkIn ? 'Menyimpan...' : 'Simpan Walk-In'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );

  function setVisitorNameLocal(val: string) {
    setWalkInVisitorName(val);
  }
}
