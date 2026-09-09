'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useBookingRepository } from '../../../lib/repository/use-booking-repository';
import { BusinessProfile, Service } from '../../../lib/types';

export default function AdminSettingsPage() {
  const { repository, version, resetDemo } = useBookingRepository();

  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [saveMsg, setSaveMsg] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    async function load() {
      const [prof, svcs] = await Promise.all([
        repository.getBusinessProfile(),
        repository.getServices(),
      ]);
      setProfile(prof);
      setServices(svcs);
    }
    load();
  }, [repository, version]);

  const handleToggleService = async (id: string, currentActive: boolean) => {
    await repository.setServiceActive(id, !currentActive);
    const updated = await repository.getServices();
    setServices(updated);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    await repository.updateBusinessProfile(profile);
    setSaveMsg('Pengaturan studio berhasil disimpan.');
    setTimeout(() => setSaveMsg(''), 3000);
  };

  const handleResetData = async () => {
    if (confirm('Apakah kamu yakin ingin mereset seluruh data demo ke kondisi awal?')) {
      setIsResetting(true);
      await resetDemo();
      setSaveMsg('Data demo berhasil direset ke dummy data awal.');
      setTimeout(() => {
        setIsResetting(false);
        window.location.reload();
      }, 500);
    }
  };

  if (!profile) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-20 text-center font-meta-code text-xs text-ap-muted">
        Memuat pengaturan studio...
      </div>
    );
  }

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
          Pengaturan Studio & Kontrol Demo
        </h1>
        <p className="font-body-sm text-sm text-ap-muted">
          Kelola profil bisnis studio, status ketersediaan layanan, dan reset data demo browser.
        </p>
      </div>

      {saveMsg && (
        <div className="p-3 bg-ap-soft-pink border border-ap-pink/40 text-ap-pink font-meta-code text-xs rounded-[12px]">
          ✓ {saveMsg}
        </div>
      )}

      {/* Services Active Toggle */}
      <div className="bg-ap-surface-low border border-ap-line rounded-[12px] p-6 sm:p-8 flex flex-col gap-6 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-ap-line">
          <span className="font-meta-label text-xs uppercase text-ap-text font-bold tracking-wider">
            Status Layanan
          </span>
          <span className="font-meta-code text-xs text-ap-muted">
            Semua Rp50.000 • 60 Menit
          </span>
        </div>

        <div className="flex flex-col divide-y divide-ap-line">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex flex-col">
                <span className="font-headline-sm text-base font-bold text-ap-text">
                  {svc.name}
                </span>
                <span className="font-body-sm text-xs text-ap-muted">{svc.description}</span>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`font-meta-code text-xs font-semibold ${
                    svc.isActive ? 'text-green-500' : 'text-ap-muted'
                  }`}
                >
                  {svc.isActive ? 'Aktif' : 'Non-Aktif'}
                </span>
                <button
                  type="button"
                  onClick={() => handleToggleService(svc.id, svc.isActive)}
                  className={`px-3 py-1.5 rounded-[12px] text-xs font-meta-code uppercase border transition-colors ${
                    svc.isActive
                      ? 'border-ap-line bg-ap-surface text-ap-muted hover:text-ap-text'
                      : 'border-ap-pink bg-ap-pink text-white font-bold'
                  }`}
                >
                  {svc.isActive ? 'Non-aktifkan' : 'Aktifkan'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Business Profile Configuration */}
      <form
        onSubmit={handleSaveProfile}
        className="bg-ap-surface-low border border-ap-line rounded-[12px] p-6 sm:p-8 flex flex-col gap-6 shadow-xl"
      >
        <div className="flex items-center justify-between pb-3 border-b border-ap-line">
          <span className="font-meta-label text-xs uppercase text-ap-text font-bold tracking-wider">
            Profil Studio (Nilai Terverifikasi / Placeholder)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-meta-label text-xs uppercase text-ap-muted font-bold">
              Nama Studio
            </label>
            <input
              type="text"
              value={profile.studioName}
              onChange={(e) => setProfile({ ...profile, studioName: e.target.value })}
              className="bg-ap-surface border border-ap-line px-3.5 py-2 text-sm text-ap-text rounded-[12px] focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-meta-label text-xs uppercase text-ap-muted font-bold">
              Kota
            </label>
            <input
              type="text"
              value={profile.city}
              onChange={(e) => setProfile({ ...profile, city: e.target.value })}
              className="bg-ap-surface border border-ap-line px-3.5 py-2 text-sm text-ap-text rounded-[12px] focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2 flex flex-col gap-1.5">
            <label className="font-meta-label text-xs uppercase text-ap-muted font-bold">
              Alamat Lengkap
            </label>
            <input
              type="text"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="bg-ap-surface border border-ap-line px-3.5 py-2 text-sm text-ap-text rounded-[12px] focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2 flex flex-col gap-1.5">
            <label className="font-meta-label text-xs uppercase text-ap-muted font-bold">
              Petunjuk Kedatangan & Parkir
            </label>
            <input
              type="text"
              value={profile.arrivalNote}
              onChange={(e) => setProfile({ ...profile, arrivalNote: e.target.value })}
              className="bg-ap-surface border border-ap-line px-3.5 py-2 text-sm text-ap-text rounded-[12px] focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-meta-label text-xs uppercase text-ap-muted font-bold">
              Nomor WhatsApp Studio
            </label>
            <input
              type="text"
              value={profile.whatsapp}
              onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
              className="bg-ap-surface border border-ap-line px-3.5 py-2 text-sm text-ap-text rounded-[12px] focus:outline-none font-meta-time"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-meta-label text-xs uppercase text-ap-muted font-bold">
              Kapasitas Kursi
            </label>
            <input
              type="text"
              disabled
              value={`${profile.chairCount} Kursi (Tunggal)`}
              className="bg-ap-surface-high border border-ap-line px-3.5 py-2 text-sm text-ap-muted rounded-[12px] cursor-not-allowed"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-ap-line flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-[12px] bg-ap-text hover:bg-ap-pink text-ap-bg hover:text-white font-meta-label text-xs uppercase font-bold tracking-wider transition-colors shadow-sm"
          >
            Simpan Perubahan Profil
          </button>
        </div>
      </form>

      {/* Demo Reset Danger Zone */}
      <div className="bg-ap-surface-low border border-ap-error/40 rounded-[12px] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div className="flex flex-col gap-1">
          <span className="font-meta-label text-xs uppercase tracking-widest text-ap-error font-bold">
            Zona Kontrol Demo M2
          </span>
          <h3 className="font-headline-sm text-lg font-bold text-ap-text">
            Reset Semua Data Demo ke Kondisi Awal
          </h3>
          <p className="font-body-sm text-xs text-ap-muted max-w-lg leading-relaxed">
            Menghapus seluruh modifikasi booking, walk-in, dan libur yang dibuat selama pengujian, lalu mengembalikan data dummy awal agar kamu bisa mengulang skenario uji coba dari nol.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetData}
          disabled={isResetting}
          className="px-6 py-3 rounded-[12px] bg-ap-error hover:brightness-110 text-white font-meta-label text-xs uppercase font-bold tracking-widest transition-all shadow-md shrink-0 disabled:opacity-50"
        >
          {isResetting ? 'Mereset Data...' : 'Reset Data Demo'}
        </button>
      </div>
    </div>
  );
}
