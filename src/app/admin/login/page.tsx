'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState('1234');

  const handleEnter = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('aparatrambut_admin_demo', 'true');
    }
    router.push('/admin');
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-16 sm:py-24 flex flex-col gap-8">
      <div className="flex flex-col items-center text-center gap-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-ap-soft-pink border border-ap-pink/30 text-ap-pink font-meta-code text-xs font-bold rounded-sm">
          <span className="w-2 h-2 rounded-full bg-ap-pink animate-pulse"></span>
          GERBANG AKSES DEMO M2
        </div>
        <h1 className="font-headline-md text-3xl font-extrabold text-ap-text tracking-tight">
          Admin Agenda
        </h1>
        <p className="font-body-sm text-xs text-ap-muted max-w-xs leading-relaxed">
          Ruang kerja kapster untuk mengelola agenda harian, walk-in, dan status kehadiran.
        </p>
      </div>

      <div className="bg-ap-surface-low border border-ap-line p-8 rounded-[12px] shadow-xl flex flex-col gap-6">
        <div className="p-3 bg-ap-surface border border-ap-line text-[11px] font-meta-code text-ap-muted leading-relaxed rounded-[12px]">
          ℹ <strong>Catatan Demo:</strong> Ini adalah simulasi demo M2. Data disimpan di browser lokal tanpa otentikasi server produksi.
        </div>

        <form onSubmit={handleEnter} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-meta-label text-xs uppercase text-ap-muted font-bold">
              Demo PIN Kapster
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full bg-ap-surface border border-ap-line px-4 py-3 text-center tracking-widest font-mono text-base text-ap-text rounded-[12px] focus:outline-none focus:border-ap-pink"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-ap-pink hover:bg-ap-text text-white font-meta-label text-xs uppercase font-bold tracking-widest rounded-[12px] transition-colors shadow-md"
          >
            Masuk ke Agenda Hari Ini →
          </button>
        </form>

        <div className="pt-4 border-t border-ap-line flex items-center justify-between text-xs font-meta-code">
          <Link href="/" className="text-ap-muted hover:text-ap-text">
            ← Kembali ke Website
          </Link>
          <span className="text-ap-pink">Satu Kursi</span>
        </div>
      </div>
    </div>
  );
}
