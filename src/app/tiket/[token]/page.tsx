'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useBookingRepository } from '../../../lib/repository/use-booking-repository';
import { Booking } from '../../../lib/types';
import { formatIndonesianDate } from '../../../lib/time';
import { Modal } from '../../../components/Modal';

export default function TiketPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const { repository, version } = useBookingRepository();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  const [copied, setCopied] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');

  useEffect(() => {
    async function loadTicket() {
      if (!token) return;
      const data = await repository.getBookingByTicketToken(token);
      setBooking(data);
      setLoading(false);
    }
    loadTicket();
  }, [token, repository, version]);

  const handleCopyCode = () => {
    if (!booking) return;
    navigator.clipboard.writeText(booking.bookingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmCancel = async () => {
    if (!token) return;
    setIsCancelling(true);
    setCancelError('');

    try {
      const res = await repository.cancelBooking(token);
      if (res.success) {
        setIsCancelModalOpen(false);
        const updated = await repository.getBookingByTicketToken(token);
        setBooking(updated);
      } else {
        setCancelError(res.error || 'Gagal membatalkan booking.');
      }
    } catch {
      setCancelError('Terjadi kesalahan.');
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-20 text-center font-meta-code text-xs text-ap-muted">
        Memuat tiket digital...
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-20 flex flex-col items-center gap-6 text-center">
        <div className="w-12 h-12 rounded-full bg-ap-soft-pink text-ap-pink flex items-center justify-center font-meta-code text-xl font-bold">
          ✕
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="font-headline-sm text-2xl font-bold text-ap-text">
            Tiket Tidak Ditemukan
          </h1>
          <p className="font-body-sm text-sm text-ap-muted max-w-md">
            Link tiket tidak valid atau sudah tidak berlaku. Pastikan kamu membuka link resmi yang didapatkan saat reservasi.
          </p>
        </div>
        <Link
          href="/booking"
          className="px-6 py-3 rounded-[12px] bg-ap-pink text-white font-meta-label text-xs uppercase font-bold tracking-wider"
        >
          Buat Booking Baru ↗
        </Link>
      </div>
    );
  }

  const getStatusBadge = () => {
    switch (booking.status) {
      case 'BOOKED':
        return (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-ap-soft-pink border border-ap-pink/40 text-ap-pink font-meta-label text-xs uppercase font-bold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-ap-pink"></span>
            <span>Booking Terkonfirmasi</span>
          </div>
        );
      case 'COMPLETED':
        return (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-ap-surface-low border border-ap-line text-green-500 font-meta-label text-xs uppercase font-bold tracking-wider">
            <span>✓ Layanan Selesai</span>
          </div>
        );
      case 'CANCELLED':
        return (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-ap-surface-high border border-ap-line text-ap-muted font-meta-label text-xs uppercase font-bold tracking-wider line-through">
            <span>✕ Booking Dibatalkan</span>
          </div>
        );
      case 'NO_SHOW':
        return (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-ap-error-container text-ap-error font-meta-label text-xs uppercase font-bold tracking-wider">
            <span>Tidak Hadir (No-Show)</span>
          </div>
        );
      case 'WALK_IN':
        return (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-ap-soft-pink text-ap-pink font-meta-label text-xs uppercase font-bold tracking-wider">
            <span>Walk-In Terdaftar</span>
          </div>
        );
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Halo aparatrambut, saya ingin konfirmasi tiket booking ${booking.bookingCode} atas nama ${booking.visitorName} untuk tanggal ${booking.date} pukul ${booking.startTime} WIB.`
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 flex flex-col gap-8">
      {/* Header Protocol Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-ap-line">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-ap-pink"></span>
          <span className="font-meta-label text-xs uppercase tracking-widest text-ap-text font-bold">
            TIKET BOOKING DIGITAL
          </span>
        </div>
        <div className="flex items-center gap-4 font-meta-code text-xs text-ap-muted">
          <span>KODE: {booking.bookingCode}</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">SATU KURSI</span>
        </div>
      </div>

      {/* Main Editorial Ticket Board */}
      <div className="w-full bg-ap-surface-low border border-ap-line rounded-[12px] overflow-hidden shadow-2xl">
        {/* Top Strip: Massive Code & Status */}
        <div className="p-6 sm:p-10 border-b border-ap-line bg-ap-surface/60 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-ap-muted font-meta-code text-xs">
              <span className="text-ap-pink text-sm">•</span>
              <span>KODE BOOKING</span>
            </div>
            <h1 className="font-meta-code text-5xl sm:text-7xl font-extrabold tracking-tight text-ap-text select-all">
              {booking.bookingCode}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {getStatusBadge()}
            <button
              onClick={handleCopyCode}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-ap-surface border border-ap-line hover:border-ap-text/40 text-ap-text font-meta-code text-xs uppercase transition-colors"
            >
              <span>{copied ? '✓ Tersalin!' : 'Salin Kode'}</span>
            </button>
          </div>
        </div>

        {/* Ticket Core: Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-ap-line">
          {/* Left Column: Session Manifest (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between gap-8">
            <div className="space-y-6">
              {/* Line 01: Visitor Name */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pb-5 border-b border-ap-line/40">
                <span className="font-meta-label text-xs uppercase text-ap-muted tracking-wider">
                  Nama yang Datang
                </span>
                <div className="sm:col-span-2">
                  <p className="font-headline-sm text-lg font-bold text-ap-text">
                    {booking.visitorName}
                  </p>
                  <p className="font-meta-code text-xs text-ap-muted mt-0.5">
                    WhatsApp: {booking.phoneNormalized}
                  </p>
                </div>
              </div>

              {/* Line 02: Service */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pb-5 border-b border-ap-line/40">
                <span className="font-meta-label text-xs uppercase text-ap-muted tracking-wider">
                  Layanan
                </span>
                <div className="sm:col-span-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-ap-pink"></span>
                    <p className="font-headline-sm text-base font-bold text-ap-text">
                      {booking.serviceName}
                    </p>
                  </div>
                  <p className="font-meta-code text-xs text-ap-muted mt-1">
                    Durasi: 60 Menit • Sesi Tunggal
                  </p>
                </div>
              </div>

              {/* Line 03: Schedule */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pb-5 border-b border-ap-line/40">
                <span className="font-meta-label text-xs uppercase text-ap-muted tracking-wider">
                  Jadwal Sesi
                </span>
                <div className="sm:col-span-2 space-y-1">
                  <p className="font-meta-time text-base font-bold text-ap-text">
                    {formatIndonesianDate(booking.date, { includeYear: true })}
                  </p>
                  <p className="font-meta-code text-xs text-ap-pink font-semibold">
                    {booking.startTime} — {booking.endTime} WIB
                  </p>
                </div>
              </div>

              {/* Line 04: Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pb-5 border-b border-ap-line/40">
                <span className="font-meta-label text-xs uppercase text-ap-muted tracking-wider">
                  Lokasi Studio
                </span>
                <div className="sm:col-span-2">
                  <p className="font-body-sm text-xs text-ap-text font-medium leading-relaxed">
                    Jl. Banjarsari Selatan No.88, Pedalangan, Kec. Tembalang, Kota Semarang
                  </p>
                  <a
                    href="https://maps.google.com/?q=Jl.+Banjarsari+Selatan+No.88,+Pedalangan,+Kec.+Tembalang,+Kota+Semarang,+Jawa+Tengah+50275"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-meta-code text-xs text-ap-pink hover:underline mt-1"
                  >
                    Buka Navigasi Peta ↗
                  </a>
                </div>
              </div>

              {/* Line 05: Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pb-5 border-b border-ap-line/40">
                <span className="font-meta-label text-xs uppercase text-ap-muted tracking-wider">
                  Catatan
                </span>
                <div className="sm:col-span-2">
                  <div className="p-3 bg-ap-surface border border-ap-line font-meta-code text-xs text-ap-text rounded-[12px]">
                    {booking.note ? `"${booking.note}"` : 'Tidak ada catatan tambahan.'}
                  </div>
                </div>
              </div>

              {/* Line 06: Total */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                <span className="font-meta-label text-xs uppercase text-ap-muted tracking-wider">
                  Total Biaya
                </span>
                <div className="sm:col-span-2 flex flex-wrap items-baseline gap-2">
                  <span className="font-headline-md text-2xl font-extrabold text-ap-text">
                    Rp50.000
                  </span>
                  <span className="font-meta-code text-xs text-ap-pink">
                    (Bayar di tempat: QRIS / Tunai pas)
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-ap-line text-[11px] font-meta-code text-ap-muted flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-ap-pink"></span>
                Satu booking untuk satu slot.
              </span>
              <span>aparatrambut Studio</span>
            </div>
          </div>

          {/* Right Column: Handlers & Actions (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-10 bg-ap-surface/30 flex flex-col justify-between gap-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-ap-line">
                <span className="font-meta-label text-xs uppercase tracking-widest text-ap-muted">
                  Petunjuk Tamu
                </span>
                <span className="font-meta-code text-xs text-ap-pink">
                  CATATAN TIKET
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 bg-ap-surface border border-ap-line rounded-[12px] flex flex-col gap-1">
                  <span className="font-meta-label text-[11px] uppercase font-bold text-ap-text">
                    01. Datang Tepat Waktu
                  </span>
                  <p className="font-body-sm text-ap-muted leading-relaxed">
                    Harap tiba 5-10 menit sebelum jadwal. Jika terlambat, kabari admin via WhatsApp agar booking-mu tetap dapat dibantu.
                  </p>
                </div>

                <div className="p-4 bg-ap-surface border border-ap-line rounded-[12px] flex flex-col gap-1">
                  <span className="font-meta-label text-[11px] uppercase font-bold text-ap-text">
                    02. Pembayaran Sederhana
                  </span>
                  <p className="font-body-sm text-ap-muted leading-relaxed">
                    Tidak ada deposit atau transfer awal. Cukup bayar Rp50.000 setelah potongan rambut selesai.
                  </p>
                </div>
              </div>

              {/* Action Stack */}
              {booking.status === 'BOOKED' && (
                <div className="space-y-3 pt-4 border-t border-ap-line">
                  {/* WhatsApp Confirmation */}
                  <a
                    href={`https://wa.me/?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 bg-ap-pink hover:bg-ap-text text-white font-meta-label text-xs font-bold uppercase tracking-wider rounded-[12px] flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99]"
                  >
                    <span>Konfirmasi via WhatsApp ↗</span>
                  </a>

                  {/* Secondary Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href={`/tiket/${token}/ubah`}
                      className="py-2.5 px-3 border border-ap-line bg-ap-surface hover:border-ap-text/40 text-ap-text font-meta-code text-xs uppercase tracking-wider rounded-[12px] text-center transition-colors"
                    >
                      Ubah Jadwal
                    </Link>

                    <button
                      type="button"
                      onClick={() => setIsCancelModalOpen(true)}
                      className="py-2.5 px-3 border border-ap-line hover:border-ap-error text-ap-muted hover:text-ap-error font-meta-code text-xs uppercase tracking-wider rounded-[12px] transition-colors"
                    >
                      Batalkan
                    </button>
                  </div>

                  <p className="text-center font-meta-code text-[10px] text-ap-muted pt-1">
                    Ubah jadwal dan pembatalan bebas biaya.
                  </p>
                </div>
              )}
            </div>

            {/* Print / Save Ticket */}
            <div className="pt-4 border-t border-ap-line flex items-center justify-between">
              <span className="font-meta-code text-[11px] text-ap-muted">
                TIKET #{booking.bookingCode}
              </span>
              <button
                type="button"
                onClick={() => window.print()}
                className="font-meta-code text-xs text-ap-text hover:text-ap-pink transition-colors underline underline-offset-4"
              >
                Cetak / Simpan Tiket
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Confirmation Modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Konfirmasi Pembatalan Booking"
      >
        <div className="flex flex-col gap-4">
          <p className="font-body-sm text-sm text-ap-muted leading-relaxed">
            Apakah kamu yakin ingin membatalkan booking untuk{' '}
            <strong className="text-ap-text">{formatIndonesianDate(booking.date)}</strong> pukul{' '}
            <strong className="text-ap-text">{booking.startTime} WIB</strong>?
          </p>
          <div className="p-3 bg-ap-error-container/30 border border-ap-error/30 text-xs font-meta-code text-ap-error rounded-[12px]">
            Slot ini akan segera dibuka kembali untuk pelanggan lain.
          </div>

          {cancelError && (
            <div className="p-3 bg-ap-error-container text-ap-error font-meta-code text-xs rounded-[12px]">
              ⚠️ {cancelError}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={isCancelling}
              onClick={() => setIsCancelModalOpen(false)}
              className="px-4 py-2.5 rounded-[12px] border border-ap-line text-xs font-meta-code text-ap-text hover:bg-ap-surface-low"
            >
              Kembali
            </button>
            <button
              type="button"
              disabled={isCancelling}
              onClick={handleConfirmCancel}
              className="px-5 py-2.5 rounded-[12px] bg-ap-error text-white text-xs font-meta-code font-bold hover:brightness-110"
            >
              {isCancelling ? 'Membatalkan...' : 'Ya, Batalkan Booking'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
