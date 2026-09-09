import { z } from 'zod';

/**
 * Normalizes an Indonesian phone number to E.164-like standard without leading +
 * Examples:
 *  "0812-3456-7890" -> "6281234567890"
 *  "+62 812 3456 7890" -> "6281234567890"
 *  "6281234567890" -> "6281234567890"
 */
export function normalizePhoneNumber(raw: string): string {
  const cleaned = raw.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+62')) {
    return cleaned.slice(1);
  }
  if (cleaned.startsWith('0')) {
    return '62' + cleaned.slice(1);
  }
  if (cleaned.startsWith('+')) {
    return cleaned.slice(1);
  }
  return cleaned;
}

export function isValidPhoneNumber(raw: string): boolean {
  const normalized = normalizePhoneNumber(raw);
  // Indonesian numbers generally start with 628 and are 10-14 digits long
  return /^62\d{8,13}$/.test(normalized);
}

export const bookingFormSchema = z.object({
  serviceId: z.string().min(1, 'Pilih salah satu layanan'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal tidak valid'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format jam tidak valid'),
  visitorName: z
    .string()
    .trim()
    .min(2, 'Nama pengunjung minimal 2 karakter')
    .max(80, 'Nama pengunjung maksimal 80 karakter'),
  whatsapp: z
    .string()
    .trim()
    .refine((val) => isValidPhoneNumber(val), {
      message: 'Nomor WhatsApp tidak valid (contoh: 0812-3456-7890)',
    }),
  note: z.string().trim().max(300, 'Catatan maksimal 300 karakter').optional(),
});

export const rescheduleSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal tidak valid'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format jam tidak valid'),
});

export const walkInSchema = z.object({
  serviceId: z.string().min(1, 'Pilih layanan'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal tidak valid'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format jam tidak valid'),
  visitorName: z
    .string()
    .trim()
    .min(2, 'Nama pengunjung minimal 2 karakter')
    .max(80, 'Nama pengunjung maksimal 80 karakter'),
  whatsapp: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || isValidPhoneNumber(val), {
      message: 'Nomor WhatsApp tidak valid',
    }),
  note: z.string().trim().max(300, 'Catatan maksimal 300 karakter').optional(),
});

export const holidaySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal tidak valid'),
  reason: z.string().trim().max(100, 'Alasan maksimal 100 karakter').optional(),
});
