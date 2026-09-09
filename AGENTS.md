# aparatrambut — Agent Onboarding & Working Agreement

## Read this first

aparatrambut is entering **M2: an interactive kapster-validation demo**. It must feel like a complete customer-to-admin booking journey with dummy data, but it is not a production booking system. The immediate outcome is a Vercel deployment that the kapster can try on desktop or mobile and critique.

Before proposing or changing anything, read [PRD.md](./PRD.md). The PRD is the product source of truth. This document tells you how to work within it.

Priority when instructions conflict:

1. The owner's newest explicit request.
2. `PRD.md`.
3. This file.
4. Existing implementation and visual artifacts.

Do not invent product rules, operational policies, real-world business information, or a technology decision that has not been approved.

## M2 stack and deployment

- **Next.js App Router + TypeScript** is the application framework.
- **Tailwind CSS** is allowed only as the implementation layer for the project's own design tokens and components. Do not ship default Tailwind/shadcn-looking UI.
- **Zod** validates form data and demo action payloads.
- **Seeded dummy data + browser `localStorage`** hold mutable demo state. Do not add a database, Supabase, ORM, CMS, real WhatsApp integration, payment, analytics, or production authentication in M2.
- **Vercel** is the M2 deployment target. The later paid production phase may move to a VPS.
- Route handlers/server utilities are allowed for a backend-shaped architecture, but mutable state must not depend on a Vercel function's memory.

The M2 demo is deliberately single-browser state: actions made on one device do not sync to another. This limitation must be visible in project documentation/demo notes, never hidden as if it were live operational data.

## Current artifact map

| Location | What it is | How to use it |
|---|---|---|
| `PRD.md` | Product rules, IA, privacy/security requirements, and milestone scope. | Read before work. Treat it as canonical. |
| `Designs/Stitch Design/stitch_aparatrambut_editorial_barber_platform/*/code.html` | M1 visual prototypes for customer landing, services, booking, ticket, and admin agenda in light/dark themes. | Use as visual and content reference, not production code to copy blindly. |
| `Designs/Stitch Design/stitch_aparatrambut_editorial_barber_platform/final-polish.css` | Shared final visual corrections. | This is the visual source of truth for the prototypes. |
| `Designs/Stitch Design/stitch_aparatrambut_editorial_barber_platform/*/screen.png` | Older Stitch exports. | Do not use as the final spec; they may disagree with the HTML/CSS. |

M1 prototype coverage is intentionally partial: Beranda, Layanan, Booking, private Tiket, and Admin Agenda are designed. Tentang and Alamat content exists as landing-page blocks and must become standalone routes during the build. Admin Login/demo gate, Booking Detail, Holidays, and Settings are required M2 surfaces and must extend the established system rather than introduce a separate visual style.

## Non-negotiable product contract

- One barber chair; one booking per slot.
- `Asia/Jakarta`; opening hours 10:00–21:00; final online start is 20:00.
- Every service is 60 minutes and Rp50.000. Services are distinct despite equal price/duration.
- No customer account. Collect visitor name, WhatsApp contact, and optional note.
- The booking may be made by one person for another. The displayed visitor name can differ from the WhatsApp owner.
- One normalized WhatsApp number can hold one future `BOOKED` appointment only.
- Rescheduling can happen repeatedly if the target slot is open. It must be atomic; never discard the old slot before the new one is safely held.
- Customer cancellation is allowed only after a clear confirmation.
- `NO_SHOW` is chosen manually by admin. Never auto-mark it from lateness. A past no-show may book again.
- Admin can record walk-ins, including a slot after the online cut-off/past slot.
- Admin can close a whole date through the Hari Libur control. Do not solve sudden closure one slot at a time.
- There is no weekly agenda requirement. Optimize admin for today.
- Booking code is readable, e.g. `APT-7K2M`, but never sufficient to open a ticket.
- Private ticket actions need a high-entropy, revocable possession token; admin actions need separate authenticated admin access.

## Design and copy guardrails

### Design direction

- The reference is editorial restraint and typography, inspired by OKC Media without reproducing its identifiable patterns.
- Never use large circular CTAs or copy the reference site's circle-button signature.
- Primary action buttons use a calm 12px corner radius. Avoid sharp boxed controls.
- Light mode: `#F7F5F6` page, `#FFFFFF` surfaces, `#211E20` ink, `#D9446A` accent.
- Dark mode: near-black surfaces, soft off-white text, `#F05A7E` accent. Do not leak dark backgrounds/text into light mode.
- Build desktop (1280–1440px) and mobile (390–480px) as equal primary targets. Do not shrink a desktop layout as the only mobile strategy.
- Avoid generic icon-library decoration. Use a label first; any icon must earn its place and remain accessible.

### Writing direction

- Write in clear, warm Indonesian: practical local-barber language, not app/system language.
- Keep copy short and useful. Explain service, time, price, arrival, and the next action.
- Avoid phrases such as “atelier”, “ritual”, “protocol”, “concierge”, “accession”, and “system” in customer-facing copy.
- Do not fabricate numbers, reviews, testimonials, addresses, maps, social links, staff facts, or availability claims.
- Keep real-world values in a managed business profile. Until verified, retain placeholders such as `[Alamat studio]`, `[Kota]`, and `[Catatan kedatangan]`.
- Make the visitor-name / booker-WhatsApp distinction explicit in the booking flow.
- Lateness help may direct a customer to contact admin, but must not imply automatic no-show.

## Build discipline

### Before implementation

1. Read the relevant PRD sections and the prototype HTML/CSS for the route you will build.
2. Identify user-owned/unrelated working-tree changes; preserve them.
3. State assumptions that would alter the product contract before proceeding.
4. Plan the route's localStorage state, empty/loading/error/confirmation states, and mobile/desktop behavior before coding.

### While implementing

- Implement a `BookingRepository` (or equivalent) boundary. Components and feature logic must not directly read/write `localStorage`; a `LocalStorageBookingRepository` owns that temporary mechanism.
- Seed demo data on first visit, persist state through refresh, and provide an intentional Reset data demo action.
- Enforce availability, capacity, and normalized-phone rules in the demo repository, not only in form UI. Treat it as a behavioural simulation, not a concurrency guarantee.
- Treat ticket tokens as demo-only opaque values. Never authorize from booking code, sequential ID, or public UUID alone; do not claim M2 ticket links are production-secure.
- Normalize phone numbers consistently before applying uniqueness rules.
- Compute dates and time slots in `Asia/Jakarta`.
- Clearly label admin access as a demo gate; do not market it as authenticated access.
- Design error, empty, loading, conflict, holiday, and confirmation states; the happy path alone is incomplete.
- Bind address, map, WhatsApp destination, hours, and content images to verified configuration/content, not design mock data.
- Keep each new screen visually consistent with `final-polish.css`, including both theme variants and responsive layouts.
- Do not use process memory, module variables, or a Vercel route handler as a database. They are not durable across requests or instances.

### When reviewing a change

Check these failure modes first:

- A local refresh loses a booking or a Reset data demo action is missing.
- Components bypass the repository and manipulate `localStorage` independently.
- A reschedule releases the old booking when the new slot fails.
- The same phone can create multiple active future `BOOKED` records.
- A readable booking code grants ticket access.
- A holiday still exposes public bookable slots.
- The client can set `NO_SHOW` or mutate another customer's booking.
- The demo claims multi-device sync, durable server data, real authentication, or production-grade ticket security.
- Light screens retain dark-mode surfaces/text.
- New copy introduces invented facts, bloat, or generic app language.
- Desktop and mobile hierarchy diverge or become unusable.

## Definition of done for a worker task

A task is not done merely because the UI looks plausible. Deliver:

1. The requested code or documentation change.
2. Appropriate verification for the risk: type/lint/build checks, interactive localStorage flow checks, and visual checks where UI changed.
3. A successful Vercel-compatible production build whenever application code changes.
4. A short summary of changed behavior, demo limitations, and the exact files touched.
5. No unrelated refactor, fabricated business content, database addition, or scope expansion.

If a request would choose product policy, real business data, or architecture beyond this agreement, stop at a concrete recommendation and ask the owner to decide.
