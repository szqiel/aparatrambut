import { Booking, BusinessProfile, Holiday, Service } from '../types';
import { calculateEndTime, getJakartaTodayString } from '../time';

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'svc-reguler',
    name: 'Reguler Haircut',
    description: 'Potongan rambut sesuai gaya yang kamu mau.',
    durationMinutes: 60,
    priceIdr: 50000,
    isActive: true,
  },
  {
    id: 'svc-shaving',
    name: 'Haircut + Shaving',
    description: 'Potongan rambut sekaligus merapikan jenggot dan kumis.',
    durationMinutes: 60,
    priceIdr: 50000,
    isActive: true,
  },
  {
    id: 'svc-hairspa',
    name: 'Haircut + Hair SPA',
    description: 'Potongan rambut dengan perawatan tambahan untuk rambut dan kulit kepala.',
    durationMinutes: 60,
    priceIdr: 50000,
    isActive: true,
  },
];

export const INITIAL_BUSINESS_PROFILE: BusinessProfile = {
  studioName: 'aparatrambut',
  chairCount: 1,
  openHour: 10,
  closeHour: 21,
  lastOnlineBookingHour: 20,
  address: 'Jl. Banjarsari Selatan No.88, Pedalangan, Kec. Tembalang',
  city: 'Kota Semarang, Jawa Tengah 50275',
  arrivalNote: '[Catatan kedatangan]',
  whatsapp: '[Nomor WhatsApp]',
  mapsUrl:
    'https://maps.google.com/?q=Jl.+Banjarsari+Selatan+No.88,+Pedalangan,+Kec.+Tembalang,+Kota+Semarang,+Jawa+Tengah+50275',
};

export function getInitialBookings(): Booking[] {
  const today = getJakartaTodayString();

  return [
    {
      id: 'book-1001',
      bookingCode: 'APT-10DA',
      ticketToken: 'token-dimas-arya-1001',
      serviceId: 'svc-reguler',
      serviceName: 'Reguler Haircut',
      date: today,
      startTime: '10:00',
      endTime: calculateEndTime('10:00'),
      visitorName: 'Dimas Arya',
      phoneNormalized: '6287819203341',
      note: 'Fade tipis samping, potongan rapi.',
      status: 'COMPLETED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'book-1002',
      bookingCode: 'APT-11FN',
      ticketToken: 'token-fajar-nugraha-1002',
      serviceId: 'svc-shaving',
      serviceName: 'Haircut + Shaving',
      date: today,
      startTime: '11:00',
      endTime: calculateEndTime('11:00'),
      visitorName: 'Fajar Nugraha',
      phoneNormalized: '6282144332109',
      note: 'Merapikan jenggot dan kumis rapi.',
      status: 'COMPLETED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'book-1003',
      bookingCode: 'APT-7K2M',
      ticketToken: 'demo-ticket-raditya-7k2m',
      serviceId: 'svc-reguler',
      serviceName: 'Reguler Haircut',
      date: today,
      startTime: '13:00',
      endTime: calculateEndTime('13:00'),
      visitorName: 'Raditya Pratama',
      phoneNormalized: '6281288904112',
      note: 'Fade 0.5 taper, request pomade matte clay.',
      status: 'BOOKED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'book-1004',
      bookingCode: 'APT-15WL',
      ticketToken: 'token-walkin-budi-1004',
      serviceId: 'svc-reguler',
      serviceName: 'Reguler Haircut',
      date: today,
      startTime: '15:00',
      endTime: calculateEndTime('15:00'),
      visitorName: 'Budi Santoso',
      phoneNormalized: '6285678112098',
      note: 'Walk-in langsung ke studio.',
      status: 'WALK_IN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'book-1005',
      bookingCode: 'APT-17KS',
      ticketToken: 'demo-ticket-kevin-17ks',
      serviceId: 'svc-hairspa',
      serviceName: 'Haircut + Hair SPA',
      date: today,
      startTime: '17:00',
      endTime: calculateEndTime('17:00'),
      visitorName: 'Kevin Sanjaya',
      phoneNormalized: '6281390905544',
      note: 'Perawatan kulit kepala dan pijat relaksasi.',
      status: 'BOOKED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

export function getInitialHolidays(): Holiday[] {
  // Initially no holidays set so the demo has open slots
  return [];
}
