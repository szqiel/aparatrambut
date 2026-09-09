/**
 * Asia/Jakarta timezone utilities (UTC+7)
 */

export const TIMEZONE = 'Asia/Jakarta';
export const OPEN_HOUR = 10; // 10:00
export const CLOSE_HOUR = 21; // 21:00
export const LAST_ONLINE_START_HOUR = 20; // 20:00

/**
 * Returns current Date adjusted to Asia/Jakarta components
 */
export function getJakartaNow(): Date {
  const now = new Date();
  // Format as string in Asia/Jakarta then parse
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const parts = formatter.formatToParts(now);
  const partMap: Record<string, string> = {};
  for (const part of parts) {
    partMap[part.type] = part.value;
  }
  return new Date(
    `${partMap.year}-${partMap.month}-${partMap.day}T${partMap.hour}:${partMap.minute}:${partMap.second}+07:00`
  );
}

/**
 * Returns current date string in Asia/Jakarta as YYYY-MM-DD
 */
export function getJakartaTodayString(): string {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(now); // en-CA produces YYYY-MM-DD
}

/**
 * Returns current time string in Asia/Jakarta as HH:mm
 */
export function getJakartaCurrentTimeString(): string {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return formatter.format(now);
}

/**
 * Generates all 1-hour slots from 10:00 to 20:00 (end 21:00)
 */
export function getAllStandardSlots(): { startTime: string; endTime: string }[] {
  const slots: { startTime: string; endTime: string }[] = [];
  for (let hour = OPEN_HOUR; hour <= LAST_ONLINE_START_HOUR; hour++) {
    const startStr = `${hour.toString().padStart(2, '0')}:00`;
    const endHour = hour + 1;
    const endStr = `${endHour.toString().padStart(2, '0')}:00`;
    slots.push({ startTime: startStr, endTime: endStr });
  }
  return slots;
}

/**
 * Calculates 60-minute end time from start time
 */
export function calculateEndTime(startTime: string): string {
  const [hStr, mStr] = startTime.split(':');
  const hour = parseInt(hStr, 10);
  const nextHour = (hour + 1).toString().padStart(2, '0');
  return `${nextHour}:${mStr}`;
}

/**
 * Checks if a specific slot on a specific date is in the past in Asia/Jakarta
 */
export function isSlotInPast(date: string, startTime: string): boolean {
  const today = getJakartaTodayString();
  if (date < today) return true;
  if (date > today) return false;
  
  const currentTime = getJakartaCurrentTimeString();
  return startTime <= currentTime;
}

/**
 * Formats YYYY-MM-DD into Indonesian human date, e.g. "Kamis, 24 Okt"
 */
export function formatIndonesianDate(dateStr: string, opts?: { includeYear?: boolean; shortMonth?: boolean }): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    
    return new Intl.DateTimeFormat('id-ID', {
      timeZone: TIMEZONE,
      weekday: 'long',
      day: 'numeric',
      month: opts?.shortMonth ? 'short' : 'long',
      year: opts?.includeYear ? 'numeric' : undefined,
    }).format(d);
  } catch {
    return dateStr;
  }
}

/**
 * Formats a date relative label: "Hari Ini", "Besok", or weekday
 */
export function getDateRelativeBadge(dateStr: string): string {
  const today = getJakartaTodayString();
  if (dateStr === today) return 'Hari Ini';
  
  const [y, m, d] = today.split('-').map(Number);
  const tomorrow = new Date(Date.UTC(y, m - 1, d + 1, 12, 0, 0));
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);
  if (dateStr === tomorrowStr) return 'Besok';

  // Check if weekend (Saturday or Sunday)
  const [targetY, targetM, targetD] = dateStr.split('-').map(Number);
  const targetDate = new Date(Date.UTC(targetY, targetM - 1, targetD, 12, 0, 0));
  const dayOfWeek = targetDate.getUTCDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) return 'Weekend';

  return 'Sedia';
}

/**
 * Returns an array of consecutive days starting from today in Asia/Jakarta
 */
export function getUpcomingDays(count: number = 7): string[] {
  const today = getJakartaTodayString();
  const [y, m, d] = today.split('-').map(Number);
  const days: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const dateObj = new Date(Date.UTC(y, m - 1, d + i, 12, 0, 0));
    days.push(dateObj.toISOString().slice(0, 10));
  }
  return days;
}
