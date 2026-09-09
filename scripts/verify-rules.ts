import { normalizePhoneNumber, isValidPhoneNumber } from '../src/lib/validation';
import { calculateEndTime, getAllStandardSlots, formatIndonesianDate } from '../src/lib/time';

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

console.log('--- Testing Phone Normalization ---');
assert(normalizePhoneNumber('0812-3456-7890') === '6281234567890', '0812-3456-7890 normalizes to 6281234567890');
assert(normalizePhoneNumber('+62 812 3456 7890') === '6281234567890', '+62 812 3456 7890 normalizes to 6281234567890');
assert(normalizePhoneNumber('6281234567890') === '6281234567890', '6281234567890 normalizes to 6281234567890');
assert(isValidPhoneNumber('0812-3456-7890'), '0812-3456-7890 is valid');
assert(isValidPhoneNumber('+62 812-3456-7890'), '+62 812-3456-7890 is valid');
assert(!isValidPhoneNumber('12345'), '12345 is invalid');

console.log('\n--- Testing Operating Hours & Slots ---');
const slots = getAllStandardSlots();
assert(slots.length === 11, `Expected 11 standard slots from 10:00 to 20:00, got ${slots.length}`);
assert(slots[0].startTime === '10:00' && slots[0].endTime === '11:00', 'First slot is 10:00 - 11:00');
assert(slots[slots.length - 1].startTime === '20:00' && slots[slots.length - 1].endTime === '21:00', 'Last online slot is 20:00 - 21:00');
assert(calculateEndTime('13:00') === '14:00', '13:00 + 60m is 14:00');
assert(calculateEndTime('20:00') === '21:00', '20:00 + 60m is 21:00');

console.log('\n--- Testing Date Formatting in Indonesian ---');
const formatted = formatIndonesianDate('2026-10-24');
assert(formatted.toLowerCase().includes('oktober') || formatted.toLowerCase().includes('sabtu'), `Formatted date contains indonesian month/day: ${formatted}`);

console.log(`\nVerification finished: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
