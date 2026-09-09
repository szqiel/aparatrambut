'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useBookingRepository } from '../../../lib/repository/use-booking-repository';
import { Holiday } from '../../../lib/types';
import { formatIndonesianDate, getJakartaTodayString } from '../../../lib/time';

export default function AdminHolidaysPage() {
  const { repository, version } = useBookingRepository();
  const [holidays, setHolidays] = useState<Holiday[]>([]);

  const [newDate, setNewDate] = useState('');
  const [newReason, setNewReason] = useState('Studio Libur');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      const hols = await repository.getHolidays();
      setHolidays(hols);
    }
    load();
    if (!newDate) {
      setNewDate(getJakartaTodayString());
    }
  }, [repository, version, newDate]);

  const handleAddHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!newDate) {
      setErrorMsg('Pilih tanggal.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await repository.addHoliday(newDate, newReason);
      if (res.success) {
        setSuccessMsg(`Tanggal ${formatIndonesianDate(newDate)} berhasil ditandai sebagai hari libur.`);
        const updated = await repository.getHolidays();
        setHolidays(updated);
      } else {
        setErrorMsg(res.error || 'Gagal menambahkan hari libur.');
      }
    } catch {
      setErrorMsg('Terjadi kesalahan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveHoliday = async (date: string) => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await repository.removeHoliday(date);
      if (res.success) {
        setSuccessMsg(`Hari libur pada tanggal ${formatIndonesianDate(date)} berhasil dihapus. Slot online dibuka kembali.`);
        const updated = await repository.getHolidays();
        setHolidays(updated);
      } else {
        setErrorMsg(res.error || 'Gagal membuka kembali tanggal.');
      }
    } catch {
      setErrorMsg('Terjadi kesalahan.');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2 pb-4 border-b border-ap-line">
        <Link
          href="/admin"
          className="font-meta-code text-xs text-ap-pink hover:underline inline-flex items-center gap-1"
        >
          ← Kembali ke Agenda Hari Ini
        </Link>
        <h1 className="font-headline-md text-3xl font-extrabold text-ap-text tracking-tight">
          Kelola Hari Libur & Tutup Studio
        </h1>
        <p className="font-body-sm text-sm text-ap-muted">
          Menandai suatu tanggal sebagai hari libur akan langsung memblokir seluruh slot online pada tanggal tersebut.
        </p>
      </div>

      {successMsg && (
        <div className="p-3 bg-ap-soft-pink border border-ap-pink/40 text-ap-pink font-meta-code text-xs rounded-[12px]">
          ✓ {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-ap-error-container text-ap-error border border-ap-error/40 font-meta-code text-xs rounded-[12px]">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Add Full-Day Closure Form */}
      <div className="bg-ap-surface-low border border-ap-line p-6 sm:p-8 rounded-[12px] flex flex-col gap-4 shadow-xl">
        <span className="font-meta-label text-xs uppercase text-ap-text font-bold tracking-wider">
          + Tandai Tanggal Tutup Baru
        </span>

        <form onSubmit={handleAddHoliday} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-4 flex flex-col gap-1.5">
            <label className="font-meta-label text-[11px] uppercase text-ap-muted font-bold">
              Pilih Tanggal
            </label>
            <input
              type="date"
              required
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="bg-ap-surface border border-ap-line px-3.5 py-2.5 text-sm text-ap-text rounded-[12px] focus:outline-none focus:border-ap-pink"
            />
          </div>

          <div className="sm:col-span-5 flex flex-col gap-1.5">
            <label className="font-meta-label text-[11px] uppercase text-ap-muted font-bold">
              Alasan Penutupan (Opsional)
            </label>
            <input
              type="text"
              placeholder="e.g. Studio Libur / Maintenance"
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              className="bg-ap-surface border border-ap-line px-3.5 py-2.5 text-sm text-ap-text rounded-[12px] focus:outline-none focus:border-ap-pink"
            />
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-[12px] bg-ap-pink hover:bg-ap-text text-white font-meta-label text-xs uppercase font-bold tracking-wider transition-colors shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Menyimpan...' : 'Tutup Tanggal'}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Full-Day Closures List */}
      <div className="bg-ap-surface-low border border-ap-line rounded-[12px] p-6 sm:p-8 flex flex-col gap-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-ap-line">
          <span className="font-meta-label text-xs uppercase text-ap-text font-bold tracking-wider">
            Daftar Tanggal Tutup Aktif
          </span>
          <span className="font-meta-code text-xs text-ap-muted">
            {holidays.length} Tanggal Ditandai
          </span>
        </div>

        {holidays.length === 0 ? (
          <div className="p-8 text-center text-xs font-meta-code text-ap-muted">
            Belum ada tanggal libur yang ditandai. Semua tanggal operasional buka normal.
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-ap-line">
            {holidays.map((h) => (
              <div
                key={h.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-ap-pink"></span>
                    <span className="font-headline-sm text-base font-bold text-ap-text">
                      {formatIndonesianDate(h.date, { includeYear: true })}
                    </span>
                  </div>
                  <span className="font-meta-code text-xs text-ap-muted mt-0.5">
                    Alasan: {h.reason || 'Studio Libur'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveHoliday(h.date)}
                  className="px-4 py-1.5 rounded-[12px] border border-ap-line hover:border-green-500 hover:text-green-500 text-xs font-meta-code transition-colors"
                >
                  Buka Kembali Studio
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
