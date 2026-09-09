'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useBookingRepository } from '../../../../lib/repository/use-booking-repository';
import { Booking, SlotAvailability } from '../../../../lib/types';
import {
  calculateEndTime,
  formatIndonesianDate,
  getDateRelativeBadge,
  getUpcomingDays,
} from '../../../../lib/time';

export default function ReschedulePage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const { repository, version } = useBookingRepository();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [holidayDates, setHolidayDates] = useState<Set<string>>(new Set());

  const [slots, setSlots] = useState<SlotAvailability[]>([]);
  const [selectedSlotTime, setSelectedSlotTime] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Load initial booking & dates
  useEffect(() => {
    async function load() {
      if (!token) return;
      const b = await repository.getBookingByTicketToken(token);
      setBooking(b);
      setLoading(false);

      if (b) {
        const upcoming = getUpcomingDays(7);
        setDates(upcoming);

        const holidays = await repository.getHolidays();
        const holSet = new Set(holidays.map((h) => h.date));
        setHolidayDates(holSet);

        // Preselect current booking date if in upcoming, otherwise first available
        if (upcoming.includes(b.date) && !holSet.has(b.date)) {
          setSelectedDate(b.date);
        } else {
          const firstOpen = upcoming.find((d) => !holSet.has(d)) || upcoming[0];
          setSelectedDate(firstOpen);
        }
      }
    }
    load();
  }, [token, repository, version]);

  // 2. Load slots when date changes
  useEffect(() => {
    async function loadSlots() {
      if (!selectedDate) return;
      const daySlots = await repository.getAvailableSlots(selectedDate);
      setSlots(daySlots);

      if (selectedSlotTime) {
        const match = daySlots.find((s) => s.startTime === selectedSlotTime);
        if (!match || !match.isAvailable) {
          setSelectedSlotTime('');
        }
      }
    }
    loadSlots();
  }, [selectedDate, repository, version, selectedSlotTime]);

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedDate) {
      setErrorMessage('Pilih tanggal baru.');
      return;
    }
    if (!selectedSlotTime) {
      setErrorMessage('Pilih jam slot baru yang tersedia.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await repository.rescheduleBooking(token, selectedDate, selectedSlotTime);
      if (!res.success) {
        setErrorMessage(res.error || 'Gagal mengubah jadwal. Jadwal lama kamu tetap aman.');
        setIsSubmitting(false);
        return;
      }

      // Success -> Return to ticket
      router.push(`/tiket/${token}`);
    } catch {
      setErrorMessage('Terjadi kendala jaringan.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-20 text-center font-meta-code text-xs text-ap-muted">
        Memuat data jadwal...
      </div>
    );
  }

  if (!booking || booking.status !== 'BOOKED') {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-20 flex flex-col items-center gap-6 text-center">
        <div className="flex flex-col gap-2">
          <h1 className="font-headline-sm text-2xl font-bold text-ap-text">
            Tidak Dapat Mengubah Jadwal
          </h1>
          <p className="font-body-sm text-sm text-ap-muted max-w-md">
            Tiket tidak ditemukan atau status booking tidak memenuhi syarat untuk dipindahkan jadwalnya.
          </p>
        </div>
        <Link
          href={`/tiket/${token}`}
          className="px-6 py-3 rounded-[12px] bg-ap-surface border border-ap-line text-ap-text font-meta-code text-xs uppercase"
        >
          Kembali ke Tiket →
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2 pb-6 border-b border-ap-line">
        <div className="flex items-center gap-2">
          <Link
            href={`/tiket/${token}`}
            className="font-meta-code text-xs text-ap-pink hover:underline"
          >
            ← Kembali ke Tiket
          </Link>
        </div>
        <h1 className="font-headline-lg text-3xl font-extrabold text-ap-text tracking-tight">
          Ubah Jadwal Booking
        </h1>
        <p className="font-body-sm text-sm text-ap-muted">
          Pilih tanggal dan jam baru yang cocok. Jadwal lamamu tetap aman sampai jadwal baru berhasil dikonfirmasi.
        </p>
      </div>

      {/* Current Booking Info Pill */}
      <div className="p-4 bg-ap-surface-low border border-ap-line rounded-[12px] flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="font-meta-label text-[10px] uppercase text-ap-muted">Jadwal Saat Ini</span>
          <span className="font-headline-sm text-base font-bold text-ap-text">
            {formatIndonesianDate(booking.date)} • {booking.startTime} WIB
          </span>
          <span className="font-meta-code text-xs text-ap-pink mt-0.5">
            {booking.serviceName} (60 Menit)
          </span>
        </div>
        <span className="px-3 py-1 bg-ap-soft-pink text-ap-pink font-meta-code text-xs font-semibold rounded-[12px]">
          Kode: {booking.bookingCode}
        </span>
      </div>

      <form onSubmit={handleRescheduleSubmit} className="flex flex-col gap-8">
        {/* 1. Date Selector */}
        <div className="bg-ap-surface-low border border-ap-line p-6 sm:p-8 flex flex-col gap-4 rounded-[12px]">
          <div className="flex items-center justify-between pb-2 border-b border-ap-line">
            <span className="font-meta-label text-xs uppercase tracking-widest text-ap-text font-bold">
              1. Pilih Tanggal Baru
            </span>
            <span className="font-meta-code text-xs text-ap-muted">
              {selectedDate ? formatIndonesianDate(selectedDate, { includeYear: true }) : ''}
            </span>
          </div>

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

        {/* 2. Slot Grid */}
        <div className="bg-ap-surface-low border border-ap-line p-6 sm:p-8 flex flex-col gap-4 rounded-[12px]">
          <div className="flex items-center justify-between pb-2 border-b border-ap-line">
            <span className="font-meta-label text-xs uppercase tracking-widest text-ap-text font-bold">
              2. Pilih Jam Baru yang Tersedia
            </span>
          </div>

          {holidayDates.has(selectedDate) ? (
            <div className="p-8 text-center text-ap-muted font-meta-code text-xs bg-ap-surface border border-ap-line rounded-[12px]">
              Studio libur pada tanggal ini.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
              {slots.map((slot) => {
                const isSelected = selectedSlotTime === slot.startTime;
                const isCurrentBookingSlot =
                  booking.date === selectedDate && booking.startTime === slot.startTime;

                // If it's the current slot, treat as available to keep, or label as current
                const isAvailable = slot.isAvailable || isCurrentBookingSlot;

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
                      {isCurrentBookingSlot
                        ? '(Jadwal saat ini)'
                        : slot.status === 'AVAILABLE'
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

        {errorMessage && (
          <div className="p-4 bg-ap-error-container text-ap-error border border-ap-error/40 font-meta-code text-xs rounded-[12px]">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Submit action */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href={`/tiket/${token}`}
            className="px-5 py-3 rounded-[12px] border border-ap-line text-ap-text font-meta-code text-xs uppercase hover:bg-ap-surface-low"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || !selectedSlotTime}
            className="px-8 py-3.5 rounded-[12px] bg-ap-pink hover:bg-ap-text text-white font-meta-label text-xs uppercase font-bold tracking-widest transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Memindahkan Jadwal...' : 'Simpan Jadwal Baru ↗'}
          </button>
        </div>
      </form>
    </div>
  );
}
