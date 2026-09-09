export type BookingStatus = 'BOOKED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW' | 'WALK_IN';

export interface Service {
  id: string;
  name: string;
  description: string;
  durationMinutes: number; // 60
  priceIdr: number; // 50000
  isActive: boolean;
}

export interface Booking {
  id: string;
  bookingCode: string; // e.g. "APT-7K2M"
  ticketToken: string; // Opaque high-entropy possession token
  serviceId: string;
  serviceName: string;
  date: string; // YYYY-MM-DD in Asia/Jakarta
  startTime: string; // HH:mm, e.g. "13:00"
  endTime: string; // HH:mm, e.g. "14:00"
  visitorName: string; // Person attending
  phoneNormalized: string; // E.g. "6281234567890"
  note?: string;
  status: BookingStatus;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface Holiday {
  id: string;
  date: string; // YYYY-MM-DD in Asia/Jakarta
  reason?: string;
  createdAt: string;
}

export interface BusinessProfile {
  studioName: string;
  chairCount: number;
  openHour: number; // 10
  closeHour: number; // 21
  lastOnlineBookingHour: number; // 20
  address: string; // "[Alamat studio]"
  city: string; // "[Kota]"
  arrivalNote: string; // "[Catatan kedatangan]"
  whatsapp: string; // "[Nomor WhatsApp]"
  mapsUrl: string; // "https://maps.google.com"
}

export interface SlotAvailability {
  startTime: string; // "10:00"
  endTime: string; // "11:00"
  isAvailable: boolean;
  status: 'AVAILABLE' | 'BOOKED' | 'WALK_IN' | 'BLOCKED' | 'PAST';
  booking?: Booking;
}

export interface CreateBookingInput {
  serviceId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  visitorName: string;
  whatsapp: string;
  note?: string;
}

export interface CreateWalkInInput {
  serviceId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  visitorName: string;
  whatsapp?: string;
  note?: string;
}
