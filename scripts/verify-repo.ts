import { LocalStorageBookingRepository } from '../src/lib/repository/local-storage-repository';

// Setup browser globals mock for Node.js test environment
class MockLocalStorage {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value.toString();
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

(global as any).window = {
  localStorage: new MockLocalStorage(),
  dispatchEvent: () => true,
};
(global as any).localStorage = (global as any).window.localStorage;
(global as any).Event = class Event {};

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`✓ ${message}`);
    passed++;
  } else {
    console.error(`✗ FAIL: ${message}`);
    failed++;
  }
}

async function runRepoTests() {
  console.log('--- Testing LocalStorageBookingRepository ---');

  const repo = new LocalStorageBookingRepository();
  repo.ensureSeeded();

  // 1. Initial services
  const services = await repo.getServices();
  assert(services.length === 3, `Expected 3 initial services, got ${services.length}`);
  assert(services[0].priceIdr === 50000, 'Service 1 price is Rp50.000');
  assert(services[0].durationMinutes === 60, 'Service 1 duration is 60m');

  // 2. Create valid future booking
  const futureDate = '2026-12-01';
  const bookingRes = await repo.createBooking({
    serviceId: services[0].id,
    date: futureDate,
    startTime: '10:00',
    visitorName: 'Agus Pratama',
    whatsapp: '0812-9988-7766',
    note: 'Rapikan samping',
  });

  assert(bookingRes.success && !!bookingRes.booking, 'Successfully created booking on 2026-12-01 10:00');
  const token = bookingRes.booking!.ticketToken;
  assert(bookingRes.booking!.bookingCode.startsWith('APT-'), `Booking code format is valid: ${bookingRes.booking?.bookingCode}`);
  assert(bookingRes.booking!.phoneNormalized === '6281299887766', 'Phone normalized to 6281299887766');

  // 3. Test slot collision on same date & time
  const collisionRes = await repo.createBooking({
    serviceId: services[1].id,
    date: futureDate,
    startTime: '10:00',
    visitorName: 'Bambang',
    whatsapp: '0813-1111-2222',
  });
  assert(!collisionRes.success && Boolean(collisionRes.error?.includes('terisi')), 'Slot collision is prevented');

  // 4. Test active phone uniqueness rule:
  // Same phone cannot create a second future BOOKED appointment
  const secondBookingSamePhone = await repo.createBooking({
    serviceId: services[1].id,
    date: futureDate,
    startTime: '11:00',
    visitorName: 'Agus Pratama',
    whatsapp: '0812-9988-7766',
  });
  assert(!secondBookingSamePhone.success && Boolean(secondBookingSamePhone.error?.includes('aktif')), 'Prevented second future booking for same phone');

  // 5. Test Reschedule - Atomic update
  // Reschedule to 11:00
  const rescheduleRes = await repo.rescheduleBooking(token, futureDate, '11:00');
  assert(rescheduleRes.success, 'Successfully rescheduled to 11:00');
  assert(rescheduleRes.booking?.startTime === '11:00', 'Booking start time updated to 11:00');

  // Old slot 10:00 should now be available again!
  const newBookingOldSlot = await repo.createBooking({
    serviceId: services[0].id,
    date: futureDate,
    startTime: '10:00',
    visitorName: 'Bambang',
    whatsapp: '0813-1111-2222',
  });
  assert(newBookingOldSlot.success, 'Freed slot 10:00 is bookable again');

  // 6. Test Holiday Blocking
  const holidayDate = '2026-12-05';
  await repo.addHoliday(holidayDate, 'Tutup Renovasi');
  const isHol = await repo.isHoliday(holidayDate);
  assert(isHol, 'Holiday successfully added');

  const bookingOnHoliday = await repo.createBooking({
    serviceId: services[0].id,
    date: holidayDate,
    startTime: '10:00',
    visitorName: 'Charlie',
    whatsapp: '0819-0000-1111',
  });
  assert(!bookingOnHoliday.success && Boolean(bookingOnHoliday.error?.includes('libur')), 'Booking on holiday date is blocked');

  // 7. Test Customer Cancellation
  const cancelRes = await repo.cancelBooking(token);
  assert(cancelRes.success, 'Customer cancellation succeeded');
  const cancelledBooking = await repo.getBookingByTicketToken(token);
  assert(cancelledBooking?.status === 'CANCELLED', 'Booking status is now CANCELLED');

  // After cancellation, the same phone CAN book again!
  const rebookingRes = await repo.createBooking({
    serviceId: services[0].id,
    date: futureDate,
    startTime: '14:00',
    visitorName: 'Agus Pratama',
    whatsapp: '0812-9988-7766',
  });
  assert(rebookingRes.success, 'Same phone can book again after previous appointment is cancelled');

  // 8. Test Admin Walk-In
  const walkInRes = await repo.addWalkIn({
    serviceId: services[0].id,
    date: futureDate,
    startTime: '16:00',
    visitorName: 'Tamu Langsung',
  });
  assert(walkInRes.success && walkInRes.booking?.status === 'WALK_IN', 'Admin can record walk-in');

  console.log(`\nRepository test finished: ${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

runRepoTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
