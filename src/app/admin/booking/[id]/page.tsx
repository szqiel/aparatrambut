'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useBookingRepository } from '../../../../lib/repository/use-booking-repository';
import { Booking, BookingStatus } from '../../../../lib/types';
import { formatIndonesianDate } from '../../../../lib/time';

export default function AdminBookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { repository, version } = useBookingRepository();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    async function load() {
      if (!id) return;
      const b = await repository.getBookingById(id);
      setBooking(b);
      setLoading(false);
    }
    load();
  }, [id, repository, version]);

  const handleUpdateStatus = async (newStatus: BookingStatus) => {
    if (!booking) return;
    await repository.updateBookingStatus(booking.id, newStatus);
    const updated = await repository.getBookingById(booking.id);
    setBooking(updated);
    setStatusMessage(`Status berhasil diperbarui menjadi ${newStatus}`);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-20 text-center font-meta-code text-xs text-ap-muted">
        Memuat detail booking...
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 py-20 flex flex-col items-center gap-6 text-center">
        <h1 className="font-headline-sm text-2xl font-bold text-ap-text">
          Booking Tidak Ditemukan
        </h1>
        <Link
          href="/admin"
          className="px-6 py-2.5 rounded-[12px] bg-ap-surface border border-ap-line text-xs font-meta-code text-ap-text uppercase"
        >
          ← Kembali ke Agenda
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 flex flex-col gap-8">
      {/* Back Link & Header */}
      <div className="flex flex-col gap-2 pb-4 border-b border-ap-line">
        <Link
          href="/admin"
          className="font-meta-code text-xs text-ap-pink hover:underline inline-flex items-center gap-1"
        >
          ← Kembali ke Agenda Hari Ini
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
          <div>
            <span className="font-meta-label text-xs uppercase text-ap-muted">Detail Booking Admin</span>
            <h1 className="font-meta-code text-3xl sm:text-4xl font-extrabold text-ap-text">
              {booking.bookingCode}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-ap-soft-pink border border-ap-pink/40 text-ap-pink font-meta-code text-xs font-bold rounded-[12px]">
              {booking.status}
            </span>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 bg-ap-soft-pink border border-ap-pink/40 text-ap-pink font-meta-code text-xs rounded-[12px]">
          ✓ {statusMessage}
        </div>
      )}

      {/* Main Details Card */}
      <div className="bg-ap-surface-low border border-ap-line rounded-[12px] p-6 sm:p-8 flex flex-col gap-6 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-ap-line">
          <div>
            <span className="font-meta-label text-xs uppercase text-ap-muted">Nama Pengunjung</span>
            <p className="font-headline-sm text-xl font-bold text-ap-text mt-0.5">
              {booking.visitorName}
            </p>
          </div>

          <div>
            <span className="font-meta-label text-xs uppercase text-ap-muted">Kontak WhatsApp</span>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="font-meta-time text-base font-semibold text-ap-text">
                {booking.phoneNormalized}
              </span>
              <a
                href={`https://wa.me/${booking.phoneNormalized}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-[12px] bg-ap-surface border border-ap-line text-[11px] font-meta-code text-ap-pink hover:bg-ap-pink hover:text-white transition-colors"
              >
                Chat WA ↗
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-6 border-b border-ap-line">
          <div>
            <span className="font-meta-label text-xs uppercase text-ap-muted">Layanan</span>
            <p className="font-headline-sm text-base font-bold text-ap-text mt-0.5">
              {booking.serviceName}
            </p>
            <p className="font-meta-code text-xs text-ap-muted">60 Menit • Rp50.000</p>
          </div>

          <div>
            <span className="font-meta-label text-xs uppercase text-ap-muted">Tanggal</span>
            <p className="font-meta-time text-base font-bold text-ap-text mt-0.5">
              {formatIndonesianDate(booking.date)}
            </p>
          </div>

          <div>
            <span className="font-meta-label text-xs uppercase text-ap-muted">Jam Sesi</span>
            <p className="font-meta-time text-base font-bold text-ap-pink mt-0.5">
              {booking.startTime} – {booking.endTime} WIB
            </p>
          </div>
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-1.5 pb-6 border-b border-ap-line">
          <span className="font-meta-label text-xs uppercase text-ap-muted">Catatan Pelanggan</span>
          <p className="p-4 bg-ap-surface border border-ap-line font-meta-code text-xs text-ap-text rounded-[12px]">
            {booking.note ? `"${booking.note}"` : 'Tidak ada catatan pelanggan.'}
          </p>
        </div>

        {/* Timestamps & Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-meta-code text-ap-muted">
          <div>
            <p>Dibuat: {new Date(booking.createdAt).toLocaleString('id-ID')}</p>
            <p>Diperbarui: {new Date(booking.updatedAt).toLocaleString('id-ID')}</p>
          </div>

          <div className="sm:text-right">
            <Link
              href={`/tiket/${booking.ticketToken}`}
              target="_blank"
              className="text-ap-pink hover:underline inline-flex items-center gap-1 font-bold"
            >
              Buka Tampilan Tiket Pelanggan ↗
            </Link>
          </div>
        </div>
      </div>

      {/* Manual Status Actions */}
      <div className="bg-ap-surface-low border border-ap-line rounded-[12px] p-6 flex flex-col gap-4">
        <span className="font-meta-label text-xs uppercase tracking-wider text-ap-muted font-bold">
          Aksi Kelola Status Booking (Manual)
        </span>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => handleUpdateStatus('COMPLETED')}
            className="px-4 py-2.5 rounded-[12px] bg-ap-text text-ap-bg hover:bg-ap-pink hover:text-white text-xs font-meta-label uppercase font-bold tracking-wider transition-colors shadow-sm"
          >
            Tandai Selesai (Completed)
          </button>

          <button
            type="button"
            onClick={() => handleUpdateStatus('NO_SHOW')}
            className="px-4 py-2.5 rounded-[12px] border border-ap-line hover:border-ap-error hover:text-ap-error text-ap-muted text-xs font-meta-label uppercase font-bold tracking-wider transition-colors"
          >
            Tandai Tidak Hadir (No-Show)
          </button>

          <button
            type="button"
            onClick={() => handleUpdateStatus('CANCELLED')}
            className="px-4 py-2.5 rounded-[12px] border border-ap-line hover:border-ap-error hover:text-ap-error text-ap-muted text-xs font-meta-label uppercase font-bold tracking-wider transition-colors"
          >
            Batalkan Booking
          </button>

          {booking.status !== 'BOOKED' && (
            <button
              type="button"
              onClick={() => handleUpdateStatus('BOOKED')}
              className="px-4 py-2.5 rounded-[12px] bg-ap-surface border border-ap-line text-ap-text hover:border-ap-text text-xs font-meta-label uppercase font-bold tracking-wider transition-colors"
            >
              Kembalikan ke Status Booked
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
