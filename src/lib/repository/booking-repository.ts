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

export interface BookingRepository {
  // Services
  getServices(): Promise<Service[]>;
  getServiceById(id: string): Promise<Service | null>;
  setServiceActive(id: string, isActive: boolean): Promise<boolean>;

  // Bookings
  getBookingsForDate(date: string): Promise<Booking[]>;
  getBookingById(id: string): Promise<Booking | null>;
  getBookingByTicketToken(token: string): Promise<Booking | null>;
  createBooking(input: CreateBookingInput): Promise<{
    success: boolean;
    booking?: Booking;
    error?: string;
  }>;
  rescheduleBooking(
    ticketToken: string,
    newDate: string,
    newStartTime: string
  ): Promise<{
    success: boolean;
    booking?: Booking;
    error?: string;
  }>;
  cancelBooking(ticketToken: string): Promise<{
    success: boolean;
    error?: string;
  }>;
  addWalkIn(input: CreateWalkInInput): Promise<{
    success: boolean;
    booking?: Booking;
    error?: string;
  }>;
  updateBookingStatus(id: string, status: BookingStatus): Promise<{
    success: boolean;
    error?: string;
  }>;

  // Availability & Slots
  getAvailableSlots(date: string): Promise<SlotAvailability[]>;

  // Holidays
  getHolidays(): Promise<Holiday[]>;
  isHoliday(date: string): Promise<boolean>;
  addHoliday(date: string, reason?: string): Promise<{
    success: boolean;
    error?: string;
  }>;
  removeHoliday(date: string): Promise<{
    success: boolean;
    error?: string;
  }>;

  // Business Profile
  getBusinessProfile(): Promise<BusinessProfile>;
  updateBusinessProfile(profile: Partial<BusinessProfile>): Promise<{
    success: boolean;
    error?: string;
  }>;

  // Demo Control
  resetDemoData(): Promise<void>;
}
