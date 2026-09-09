import {
  Booking,
  BookingStatus,
  BusinessProfile,
  CreateBookingInput,
  CreateWalkInInput,
  Holiday,
  Service,
  SlotAvailability,
} from '../types';
import { BookingRepository } from './booking-repository';
import {
  INITIAL_BUSINESS_PROFILE,
  INITIAL_SERVICES,
  getInitialBookings,
  getInitialHolidays,
} from './seed-data';
import {
  calculateEndTime,
  getAllStandardSlots,
  isSlotInPast,
} from '../time';
import { normalizePhoneNumber } from '../validation';

const STORAGE_KEYS = {
  SERVICES: 'aparatrambut_services_v1',
  BOOKINGS: 'aparatrambut_bookings_v1',
  HOLIDAYS: 'aparatrambut_holidays_v1',
  PROFILE: 'aparatrambut_profile_v1',
  INIT_FLAG: 'aparatrambut_seeded_v1',
};

const UPDATE_EVENT_NAME = 'aparatrambut_state_change';

function generateBookingCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `APT-${code}`;
}

function generateTicketToken(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export class LocalStorageBookingRepository implements BookingRepository {
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  private notifyChange(): void {
    if (this.isBrowser()) {
      window.dispatchEvent(new Event(UPDATE_EVENT_NAME));
    }
  }

  public ensureSeeded(): void {
    if (!this.isBrowser()) return;

    const alreadySeeded = localStorage.getItem(STORAGE_KEYS.INIT_FLAG);
    if (!alreadySeeded) {
      this.resetDemoDataSync();
    }
  }

  private resetDemoDataSync(): void {
    if (!this.isBrowser()) return;

    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(getInitialBookings()));
    localStorage.setItem(STORAGE_KEYS.HOLIDAYS, JSON.stringify(getInitialHolidays()));
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(INITIAL_BUSINESS_PROFILE));
    localStorage.setItem(STORAGE_KEYS.INIT_FLAG, 'true');
    this.notifyChange();
  }

  public async resetDemoData(): Promise<void> {
    this.resetDemoDataSync();
  }

  // --- SERVICES ---
  public async getServices(): Promise<Service[]> {
    if (!this.isBrowser()) return INITIAL_SERVICES;
    this.ensureSeeded();

    const data = localStorage.getItem(STORAGE_KEYS.SERVICES);
    return data ? JSON.parse(data) : INITIAL_SERVICES;
  }

  public async getServiceById(id: string): Promise<Service | null> {
    const services = await this.getServices();
    return services.find((s) => s.id === id) || null;
  }

  public async setServiceActive(id: string, isActive: boolean): Promise<boolean> {
    if (!this.isBrowser()) return false;
    const services = await this.getServices();
    const target = services.find((s) => s.id === id);
    if (!target) return false;

    target.isActive = isActive;
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    this.notifyChange();
    return true;
  }

  // --- BOOKINGS ---
  private getAllBookingsSync(): Booking[] {
    if (!this.isBrowser()) return getInitialBookings();
    this.ensureSeeded();

    const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return data ? JSON.parse(data) : [];
  }

  public async getBookingsForDate(date: string): Promise<Booking[]> {
    const all = this.getAllBookingsSync();
    return all.filter((b) => b.date === date);
  }

  public async getBookingById(id: string): Promise<Booking | null> {
    const all = this.getAllBookingsSync();
    return all.find((b) => b.id === id) || null;
  }

  public async getBookingByTicketToken(token: string): Promise<Booking | null> {
    const all = this.getAllBookingsSync();
    return all.find((b) => b.ticketToken === token) || null;
  }

  public async createBooking(input: CreateBookingInput): Promise<{
    success: boolean;
    booking?: Booking;
    error?: string;
  }> {
    if (!this.isBrowser()) {
      return { success: false, error: 'Browser environment required' };
    }
    this.ensureSeeded();

    // 1. Check Holiday
    if (await this.isHoliday(input.date)) {
      return { success: false, error: 'Studio libur pada tanggal yang dipilih.' };
    }

    // 2. Check if slot is in the past
    if (isSlotInPast(input.date, input.startTime)) {
      return { success: false, error: 'Slot waktu sudah lewat dan tidak dapat dibooking.' };
    }

    const allBookings = this.getAllBookingsSync();

    // 3. Check Slot Occupancy
    const slotTaken = allBookings.some(
      (b) =>
        b.date === input.date &&
        b.startTime === input.startTime &&
        (b.status === 'BOOKED' || b.status === 'WALK_IN')
    );
    if (slotTaken) {
      return { success: false, error: 'Slot waktu sudah terisi oleh pelanggan lain.' };
    }

    // 4. Check Phone Active Booking rule:
    // One normalized WhatsApp number may have only one future BOOKED appointment at a time.
    const normalizedPhone = normalizePhoneNumber(input.whatsapp);
    const hasActiveFutureBooking = allBookings.some(
      (b) =>
        b.phoneNormalized === normalizedPhone &&
        b.status === 'BOOKED' &&
        !isSlotInPast(b.date, b.startTime)
    );
    if (hasActiveFutureBooking) {
      return {
        success: false,
        error:
          'Nomor WhatsApp ini sudah memiliki satu booking aktif yang belum selesai. Selesaikan atau batalkan booking sebelumnya sebelum membuat booking baru.',
      };
    }

    // 5. Service lookup
    const service = await this.getServiceById(input.serviceId);
    if (!service) {
      return { success: false, error: 'Layanan tidak ditemukan.' };
    }

    // 6. Create booking
    const newBooking: Booking = {
      id: `book-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      bookingCode: generateBookingCode(),
      ticketToken: generateTicketToken(),
      serviceId: service.id,
      serviceName: service.name,
      date: input.date,
      startTime: input.startTime,
      endTime: calculateEndTime(input.startTime),
      visitorName: input.visitorName.trim(),
      phoneNormalized: normalizedPhone,
      note: input.note?.trim() || undefined,
      status: 'BOOKED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    allBookings.push(newBooking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(allBookings));
    this.notifyChange();

    return { success: true, booking: newBooking };
  }

  public async rescheduleBooking(
    ticketToken: string,
    newDate: string,
    newStartTime: string
  ): Promise<{
    success: boolean;
    booking?: Booking;
    error?: string;
  }> {
    if (!this.isBrowser()) {
      return { success: false, error: 'Browser environment required' };
    }
    this.ensureSeeded();

    const allBookings = this.getAllBookingsSync();
    const targetBooking = allBookings.find((b) => b.ticketToken === ticketToken);

    if (!targetBooking) {
      return { success: false, error: 'Tiket booking tidak ditemukan.' };
    }

    if (targetBooking.status !== 'BOOKED') {
      return {
        success: false,
        error: 'Hanya booking dengan status terkonfirmasi yang dapat diubah jadwalnya.',
      };
    }

    // 1. Check Holiday
    if (await this.isHoliday(newDate)) {
      return { success: false, error: 'Studio libur pada tanggal yang dipilih.' };
    }

    // 2. Check if new slot is in past
    if (isSlotInPast(newDate, newStartTime)) {
      return { success: false, error: 'Slot waktu baru sudah lewat.' };
    }

    // 3. Check if target slot is occupied by another booking
    const slotTaken = allBookings.some(
      (b) =>
        b.id !== targetBooking.id &&
        b.date === newDate &&
        b.startTime === newStartTime &&
        (b.status === 'BOOKED' || b.status === 'WALK_IN')
    );
    if (slotTaken) {
      return {
        success: false,
        error: 'Slot baru yang kamu pilih sudah terisi. Jadwal lamamu tetap aman.',
      };
    }

    // Atomic update
    targetBooking.date = newDate;
    targetBooking.startTime = newStartTime;
    targetBooking.endTime = calculateEndTime(newStartTime);
    targetBooking.updatedAt = new Date().toISOString();

    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(allBookings));
    this.notifyChange();

    return { success: true, booking: targetBooking };
  }

  public async cancelBooking(ticketToken: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    if (!this.isBrowser()) {
      return { success: false, error: 'Browser environment required' };
    }
    this.ensureSeeded();

    const allBookings = this.getAllBookingsSync();
    const target = allBookings.find((b) => b.ticketToken === ticketToken);

    if (!target) {
      return { success: false, error: 'Tiket booking tidak ditemukan.' };
    }

    if (target.status === 'CANCELLED') {
      return { success: true };
    }

    if (target.status === 'COMPLETED') {
      return { success: false, error: 'Booking yang sudah selesai tidak dapat dibatalkan.' };
    }

    target.status = 'CANCELLED';
    target.updatedAt = new Date().toISOString();

    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(allBookings));
    this.notifyChange();

    return { success: true };
  }

  public async addWalkIn(input: CreateWalkInInput): Promise<{
    success: boolean;
    booking?: Booking;
    error?: string;
  }> {
    if (!this.isBrowser()) {
      return { success: false, error: 'Browser environment required' };
    }
    this.ensureSeeded();

    const allBookings = this.getAllBookingsSync();

    // Check if slot is occupied
    const slotTaken = allBookings.some(
      (b) =>
        b.date === input.date &&
        b.startTime === input.startTime &&
        (b.status === 'BOOKED' || b.status === 'WALK_IN')
    );
    if (slotTaken) {
      return { success: false, error: 'Slot waktu ini sudah terisi.' };
    }

    const service = await this.getServiceById(input.serviceId);
    if (!service) {
      return { success: false, error: 'Layanan tidak ditemukan.' };
    }

    const normalizedPhone = input.whatsapp
      ? normalizePhoneNumber(input.whatsapp)
      : '6280000000000';

    const walkInBooking: Booking = {
      id: `walkin-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      bookingCode: generateBookingCode(),
      ticketToken: generateTicketToken(),
      serviceId: service.id,
      serviceName: service.name,
      date: input.date,
      startTime: input.startTime,
      endTime: calculateEndTime(input.startTime),
      visitorName: input.visitorName.trim(),
      phoneNormalized: normalizedPhone,
      note: input.note?.trim() || 'Walk-in langsung di studio',
      status: 'WALK_IN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    allBookings.push(walkInBooking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(allBookings));
    this.notifyChange();

    return { success: true, booking: walkInBooking };
  }

  public async updateBookingStatus(
    id: string,
    status: BookingStatus
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.isBrowser()) {
      return { success: false, error: 'Browser environment required' };
    }
    this.ensureSeeded();

    const allBookings = this.getAllBookingsSync();
    const target = allBookings.find((b) => b.id === id);
    if (!target) {
      return { success: false, error: 'Booking tidak ditemukan.' };
    }

    target.status = status;
    target.updatedAt = new Date().toISOString();

    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(allBookings));
    this.notifyChange();

    return { success: true };
  }

  // --- AVAILABILITY ---
  public async getAvailableSlots(date: string): Promise<SlotAvailability[]> {
    const isDayClosed = await this.isHoliday(date);
    const dayBookings = await this.getBookingsForDate(date);
    const standardSlots = getAllStandardSlots();

    return standardSlots.map(({ startTime, endTime }) => {
      if (isDayClosed) {
        return {
          startTime,
          endTime,
          isAvailable: false,
          status: 'BLOCKED',
        };
      }

      // Check existing booking
      const existing = dayBookings.find(
        (b) =>
          b.startTime === startTime &&
          (b.status === 'BOOKED' || b.status === 'WALK_IN')
      );

      if (existing) {
        return {
          startTime,
          endTime,
          isAvailable: false,
          status: existing.status === 'WALK_IN' ? 'WALK_IN' : 'BOOKED',
          booking: existing,
        };
      }

      // Check if in past
      if (isSlotInPast(date, startTime)) {
        return {
          startTime,
          endTime,
          isAvailable: false,
          status: 'PAST',
        };
      }

      return {
        startTime,
        endTime,
        isAvailable: true,
        status: 'AVAILABLE',
      };
    });
  }

  // --- HOLIDAYS ---
  public async getHolidays(): Promise<Holiday[]> {
    if (!this.isBrowser()) return [];
    this.ensureSeeded();

    const data = localStorage.getItem(STORAGE_KEYS.HOLIDAYS);
    return data ? JSON.parse(data) : [];
  }

  public async isHoliday(date: string): Promise<boolean> {
    const holidays = await this.getHolidays();
    return holidays.some((h) => h.date === date);
  }

  public async addHoliday(date: string, reason?: string): Promise<{ success: boolean; error?: string }> {
    if (!this.isBrowser()) {
      return { success: false, error: 'Browser environment required' };
    }
    this.ensureSeeded();

    const holidays = await this.getHolidays();
    if (holidays.some((h) => h.date === date)) {
      return { success: false, error: 'Tanggal ini sudah ditandai sebagai hari libur.' };
    }

    holidays.push({
      id: `hol-${Date.now()}`,
      date,
      reason: reason?.trim() || 'Studio Libur',
      createdAt: new Date().toISOString(),
    });

    localStorage.setItem(STORAGE_KEYS.HOLIDAYS, JSON.stringify(holidays));
    this.notifyChange();
    return { success: true };
  }

  public async removeHoliday(date: string): Promise<{ success: boolean; error?: string }> {
    if (!this.isBrowser()) {
      return { success: false, error: 'Browser environment required' };
    }
    this.ensureSeeded();

    let holidays = await this.getHolidays();
    holidays = holidays.filter((h) => h.date !== date);

    localStorage.setItem(STORAGE_KEYS.HOLIDAYS, JSON.stringify(holidays));
    this.notifyChange();
    return { success: true };
  }

  // --- BUSINESS PROFILE ---
  public async getBusinessProfile(): Promise<BusinessProfile> {
    if (!this.isBrowser()) return INITIAL_BUSINESS_PROFILE;
    this.ensureSeeded();

    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return data ? JSON.parse(data) : INITIAL_BUSINESS_PROFILE;
  }

  public async updateBusinessProfile(
    profile: Partial<BusinessProfile>
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.isBrowser()) {
      return { success: false, error: 'Browser environment required' };
    }
    this.ensureSeeded();

    const current = await this.getBusinessProfile();
    const updated = { ...current, ...profile };

    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    this.notifyChange();
    return { success: true };
  }
}

// Singleton repository instance
export const bookingRepository = new LocalStorageBookingRepository();
