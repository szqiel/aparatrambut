# aparatrambut — Product Requirements Document

> **Status:** Active source of truth  
> **Milestone:** M1 — product contract and visual direction locked; ready for stack selection and core build  
> **Last updated:** 2026-09-09

## 1. Product

aparatrambut is a booking website for a single barber chair. Customers choose a service and an available time without needing an account. The barber/admin runs the day from a simple agenda: see today's bookings, add walk-ins, close a day, and update attendance.

The product should feel like a well-run local barbershop: clear, warm, and practical. It is not a salon marketplace, queue-management app, or CRM.

## 2. Current milestone

### Locked in M1

- Booking rules, status rules, security boundaries, and operational edge cases in this document.
- Customer information architecture: Beranda, Layanan, Tentang, Alamat, Booking, and private Tiket.
- Admin information architecture: Login, Agenda Hari Ini, Detail Booking, Hari Libur, and Pengaturan.
- Visual direction: editorial, typographic, pink-on-light / pink-on-dark; desktop and mobile are both first-class.
- Design prototypes in `Designs/Stitch Design/stitch_aparatrambut_editorial_barber_platform/`.

### Next milestone: M2 — interactive demo for kapster validation

The next deliverable is a deployable, end-to-end **demo**, not a static mock-up and not a production booking system. A kapster must be able to use the customer and admin flows from beginning to end with dummy data, then give feedback before the owner funds production hosting.

1. Implement the public pages, booking flow, ticket flow, and admin agenda with interactive demo state.
2. Let a single demo user create, reschedule, cancel, and inspect bookings; then let the admin agenda reflect those changes in that same browser.
3. Let the admin add a walk-in, mark an attendance status manually, and close/reopen a full day.
4. Deploy the demo on Vercel for review on desktop and mobile.
5. Use verified business content where available; otherwise retain explicit placeholders. Never invent operational data to make a demo feel complete.

### M2 approved technical stack

| Layer | M2 decision | Why |
|---|---|---|
| Application | Next.js App Router + TypeScript | One deployable web app for the customer and admin demo. |
| Styling | Tailwind CSS plus project-owned design tokens/components | Build the approved visual system without default component-library styling. |
| Validation | Zod | Keep form input and mock action payloads consistent. |
| Demo data | Seeded dummy data + browser `localStorage` | The demo remains interactive after refresh in one browser, without a database. |
| Server shape | Lightweight Next.js route handlers / server utilities where useful | Keep request and action boundaries ready for future replacement; do not depend on server memory for state. |
| Hosting | Vercel | Fast preview deployment for kapster feedback. |
| Database / real auth / messaging | Explicitly deferred | Add only after the client approves a paid production phase. |

### M2 demo-state contract

- `localStorage` is the source of mutable demo state. Seed it on first visit and provide a visible **Reset data demo** action for repeatable testing.
- A deployed Vercel function must never be used as an in-memory database. It can restart, scale, and lose state at any time.
- State is local to a browser/device. A booking created on one device is not expected to appear on another; this is a known demo limitation, not a bug.
- Use a repository interface (for example `BookingRepository`) so UI and feature logic do not depend directly on `localStorage`. M2 provides a demo implementation; a later production phase replaces it with a database-backed implementation.
- Demo ticket links may use a generated opaque token to preserve the intended flow, but they are not production-grade authorization without server-side persistence and verification. Use dummy data only.
- Admin access in M2 is a clearly labelled demo gate/route, not real authentication. Never represent it as secure.
- WhatsApp, email, payments, cron jobs, analytics, and real notification delivery are not part of M2. The demo can display the intended confirmation content and copy a private demo link.

### Production activation (future M3)

When the client approves the paid build, move to VPS hosting and introduce PostgreSQL, authenticated admin access, server-side token verification, persistent audit logs, transactional booking rules, and real communication delivery. Production-only guarantees in this PRD remain mandatory at that point.

## 3. Fixed business rules

| Topic | Rule |
|---|---|
| Time zone | `Asia/Jakarta` |
| Capacity | One barber chair; one booking per time slot. |
| Opening hours | 10:00–21:00. Last online booking starts at 20:00. |
| Slot duration | 60 minutes for every service. |
| Price | Rp50.000 for every service. |
| Customer account | Not required. |
| Customer data | Name of the person visiting, WhatsApp number of the booker/contact, and optional note. |
| Booking for another person | Allowed. The visitor's name may differ from the WhatsApp owner. |
| Repeat booking | One normalized WhatsApp number may have only one future `BOOKED` appointment at a time. |
| Reschedule | Allowed repeatedly while another eligible slot is open. The change is atomic. |
| Customer cancellation | Allowed from the private ticket, only after confirmation. |
| No-show | Set manually by admin only; lateness never automatically changes a booking to `NO_SHOW`. A no-show number may book again. |
| Walk-in | Admin may add a walk-in, including a past slot that online booking has already closed. |
| Holiday / sudden closure | Admin can mark an entire date as a holiday; all public slots for that date become unavailable. |
| Weekly admin calendar | Out of scope. Admin focuses on today. |

### Services

The services have the same duration and price, but represent genuinely different work:

| Service | Customer-facing description | Duration | Price |
|---|---|---:|---:|
| Reguler Haircut | Potongan rambut sesuai gaya yang kamu mau. | 60 min | Rp50.000 |
| Haircut + Shaving | Potongan rambut sekaligus merapikan jenggot dan kumis. | 60 min | Rp50.000 |
| Haircut + Hair SPA | Potongan rambut dengan perawatan tambahan untuk rambut dan kulit kepala. | 60 min | Rp50.000 |

Services can later be enabled or disabled by admin. Never imply different prices or durations unless the business rules are formally changed.

## 4. Booking lifecycle and availability

### Booking statuses

| Status | Meaning | Set by |
|---|---|---|
| `BOOKED` | A confirmed future appointment. It reserves its slot and counts toward the phone-number limit. | Customer or admin |
| `COMPLETED` | Service finished. | Admin |
| `CANCELLED` | Customer or admin released the booking. | Customer with confirmation, or admin |
| `NO_SHOW` | Customer did not attend. | Admin only |
| `WALK_IN` | An admin-recorded walk-in appointment. | Admin |

`BLOCKED` is not a booking status. It is an availability result for a holiday, closure, past online slot, or unavailable capacity.

### Online availability rules

- Generate slots in `Asia/Jakarta`; do not rely on a browser's local time zone.
- Customer booking is only possible for a future start time inside business hours, up to and including 20:00.
- A holiday closes the whole date to public booking, even if old booking rows exist.
- A slot is available only when it is not closed and no slot-reserving booking occupies it.
- Booking creation and rescheduling must enforce capacity and the active-phone rule in one atomic transaction. A UI-only check is insufficient.
- Rescheduling releases the old slot only when the new slot is successfully reserved. If the new slot loses a race, keep the old booking unchanged.
- Customer cancellation must show a clear confirmation step before the booking is released.
- Walk-ins are an admin exception and may use a past/cut-off slot. They must never make a public past slot bookable.

## 5. Access and security

### Customer ticket access

A readable booking code such as `APT-7K2M` is for human recognition. It is **not** authorization.

Customers may open or modify a ticket only after a possession check using an opaque, high-entropy, revocable ticket link/token delivered to the booking contact. The token must not be a predictable ID or plain UUID exposed as the sole secret.

Allowed ticket actions:

- View booking details.
- Reschedule to another eligible open slot.
- Cancel after explicit confirmation.

Do not put a permanent “Tiket” destination in public navigation because no ticket is meaningful without the customer's private access link.

### Admin access

- Admin pages require authenticated admin access.
- Customer ticket access and admin authentication are separate authorization paths.
- Log security-relevant admin authentication events.
- Protect booking lookup, ticket tokens, and admin operations from enumeration and replay.

## 6. Information architecture

### Customer-facing routes

| Route | Purpose | M1 visual coverage |
|---|---|---|
| `/` | Beranda: value proposition, service preview, how booking works, and clear booking CTA. | Designed |
| `/layanan` | Service descriptions and booking entry point. | Designed |
| `/tentang` | Short, human studio story and approach. | Landing-page content block; build as standalone route in M2 |
| `/alamat` | Address, arrival notes, opening hours, map, and WhatsApp contact. | Landing-page content block; build as standalone route in M2 |
| `/booking` | Select service, date, time, visitor name, WhatsApp, optional note, then confirm. | Designed |
| `/tiket/{token}` | Private booking details and customer actions. | Designed |
| `/tiket/{token}/ubah` | Private reschedule flow. | Functional requirement; build in M2 |

### Admin routes

| Route | Purpose | M1 visual coverage |
|---|---|---|
| `/admin/login` | Admin sign-in. | Functional requirement; build in M2 |
| `/admin` | Agenda Hari Ini: today's bookings, counts, walk-in, status actions, and day-off entry point. | Designed |
| `/admin/booking/{id}` | Full booking detail and admin actions. | Functional requirement; build in M2 |
| `/admin/holidays` | Mark, review, or remove full-day closures. | Functional requirement; build in M2 |
| `/admin/settings` | Business profile and service availability. | Functional requirement; build in M2 |

The M1 prototypes intentionally do not claim that every route is already designed or built. They define the visual language and the main agenda flow; the remaining functional surfaces must follow the same system during implementation.

## 7. Experience and content direction

### Design source

Use `Designs/Stitch Design/stitch_aparatrambut_editorial_barber_platform/` as the current visual reference. The final source is each screen's `code.html` plus the shared `final-polish.css`. Existing `screen.png` files are old Stitch snapshots and are not the final specification.

Design reference inspiration is the editorial restraint and typographic confidence of OKC Media, not its component shapes or visual signatures. Do not copy its circular CTA controls or other recognisable motifs.

### Visual rules

- Light mode: soft off-white page (`#F7F5F6`), white surfaces, ink (`#211E20`), and pink accent (`#D9446A`).
- Dark mode: near-black page/surfaces, soft off-white text, and pink accent (`#F05A7E`).
- Primary buttons have a calm 12px radius. Avoid boxed buttons with sharp corners and avoid large circular CTAs.
- Desktop layouts at 1280–1440px and mobile layouts at 390–480px are equally important. Responsive behavior is part of the implementation, not a later polish pass.
- Do not leave dark-mode black surfaces or text inside light-mode screens.
- Avoid generic icon-library decoration. Use clear text labels first; any icon must be deliberate, accessible, and secondary to the label.

### Copy rules

- Write normal, warm Indonesian that sounds like a good local barber speaking plainly.
- Prefer useful information over brand theatre: service, time, price, address, arrival help, and what happens next.
- No invented review counts, operating history, staff claims, addresses, maps, social accounts, testimonials, or availability claims.
- Do not use bloated product jargon such as “atelier”, “ritual”, “protocol”, “concierge”, “accession”, or “system” in customer copy.
- A booking form must make clear that the name belongs to the person visiting, while the WhatsApp number can belong to the person making the booking.
- Lateness copy may invite the customer to contact the admin, but must never threaten an automatic no-show.

### Business-profile placeholders

Until the owner supplies verified values, use managed fields/placeholders for `[Alamat studio]`, `[Kota]`, `[Catatan kedatangan]`, WhatsApp destination, map URL, approved image assets, and real opening hours. Do not hardcode fictional Jakarta/Bandung addresses or coordinates.

## 8. Core journeys

### Customer makes a booking

1. Customer enters from Beranda or Layanan and chooses a service.
2. Customer selects an eligible date and available time.
3. Customer enters the visitor's name, a WhatsApp contact, and an optional note.
4. Server validates the business rules atomically.
5. Customer sees a readable booking code and receives a private ticket link through the chosen delivery channel.

### Customer manages a ticket

1. Customer opens the private ticket link.
2. The page shows the service, date, time, booking code, visitor name, and appropriate contact guidance.
3. Customer may reschedule to any eligible empty slot or cancel after confirmation.
4. The result is communicated clearly; cancellation frees the slot.

### Admin runs today

1. Admin signs in and opens Agenda Hari Ini.
2. Admin can see today's bookings and their statuses, add a walk-in, or open a booking detail.
3. Admin may mark an appointment `COMPLETED`, `CANCELLED`, or `NO_SHOW` manually.
4. Admin can mark the whole day as holiday/closed. Public availability updates immediately.

## 9. Production data model and integrity requirements

This section is the required target for the future paid, database-backed production phase. M2 does **not** introduce a database, but its demo repository models these fields and transitions closely enough to validate the experience.

### `services`

- `id`, `name`, `description`, `duration_minutes`, `price_idr`, `is_active`, timestamps.
- Initial values are the three services in this PRD, each 60 minutes and Rp50.000.

### `bookings`

- `id`, `booking_code`, `service_id`, `start_at`, `end_at`, `visitor_name`, `phone_normalized`, `note`, `status`, timestamps.
- `booking_code` is readable and unique.
- Store ticket secrets safely; do not store an exposed bearer token in recoverable plaintext if the stack provides a secure hashing pattern.
- Preserve a usable audit trail for customer and admin changes.

### `holidays`

- `id`, `date`, `reason` (optional), `created_by`, timestamps.
- A date can have only one active full-day closure record.

### `business_profile`

- Verified studio name, address, city, arrival note, WhatsApp destination, map URL, opening hours, and approved media references.

### `admin_auth_logs`

- Enough information to audit sign-in success/failure and sensitive admin access without recording secrets.

### Required constraints

- Unique slot occupancy for statuses that reserve capacity.
- One future `BOOKED` appointment per normalized phone number.
- Unique readable booking code.
- Holiday uniqueness per date.
- Authorization checks on every ticket and admin mutation.

## 10. Communication copy

Use concise, human messages. These are tone examples, not immutable templates.

**Booking confirmation**

> Booking kamu sudah masuk untuk [hari, tanggal] pukul [jam]. Simpan link tiket ini kalau ingin ubah jadwal atau membatalkan booking: [link].

**Reschedule confirmation**

> Jadwal kamu sudah dipindahkan ke [hari, tanggal] pukul [jam]. Sampai ketemu, ya.

**Cancellation confirmation**

> Booking untuk [hari, tanggal] pukul [jam] sudah dibatalkan. Slotnya sekarang tersedia untuk orang lain.

## 11. M2 demo acceptance checklist

The Vercel demo is ready for kapster review only when it can demonstrate:

- A kapster can begin as a customer, choose service/date/time, enter visitor name + WhatsApp + note, and receive a readable booking code plus private demo ticket link.
- The ticket can reschedule to an eligible mock slot and cancel only after confirmation; both changes immediately appear in that browser's admin agenda.
- The booking form makes it clear that visitor name and WhatsApp owner can differ.
- Demo rules cover Jakarta-time presentation, 10:00–21:00 hours, 20:00 online final slot, 60-minute services, and Rp50.000 price.
- The demo prevents duplicate active slots and more than one future `BOOKED` booking per normalized WhatsApp number within its local data set, while allowing a new booking after cancellation, completion, or no-show.
- Admin can add a walk-in, set `COMPLETED` / `CANCELLED` / `NO_SHOW` manually, and mark/reopen an entire day as holiday.
- Holiday and past/cut-off slots are visibly unavailable to the public demo flow; walk-in can use the appropriate admin exception.
- Demo state survives a page refresh on the same browser and has a deliberate Reset data demo action.
- Customer pages for Beranda, Layanan, Tentang, Alamat, Booking, and Tiket; admin pages for Login/demo gate, Agenda, Detail, Holidays, and Settings are present enough to test the intended flow.
- Light and dark themes are consistent, readable, and responsive at both desktop and mobile target widths.
- The project deploys successfully to Vercel and does not rely on in-memory server state.

### Production acceptance checklist (future M3)

The paid production build additionally requires:

- Correct Jakarta-time slot generation and online cut-off behavior under concurrent real requests.
- No double booking under concurrent booking or reschedule attempts.
- Customer ticket access that is private and securely verified server-side, not merely a demo link.
- Authenticated admin access, durable audit logging, database-backed holidays, and atomic capacity/phone constraints.
- Real business-profile values loaded from managed configuration rather than invented design content.
