---
name: Atelier Hair Studio Light
colors:
  surface: '#fff7fa'
  surface-dim: '#dfd8db'
  surface-bright: '#fff7fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f9f2f4'
  surface-container: '#f4ecee'
  surface-container-high: '#eee6e9'
  surface-container-highest: '#e8e1e3'
  on-surface: '#1e1b1d'
  on-surface-variant: '#584144'
  inverse-surface: '#332f31'
  inverse-on-surface: '#f6eff1'
  outline: '#8c7074'
  outline-variant: '#dfbec2'
  surface-tint: '#b1254e'
  primary: '#ae224c'
  on-primary: '#ffffff'
  primary-container: '#d03d63'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb2be'
  secondary: '#6b5a60'
  on-secondary: '#ffffff'
  secondary-container: '#f4dde4'
  on-secondary-container: '#716066'
  tertiary: '#006a34'
  on-tertiary: '#ffffff'
  tertiary-container: '#008644'
  on-tertiary-container: '#f6fff3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9de'
  primary-fixed-dim: '#ffb2be'
  on-primary-fixed: '#400014'
  on-primary-fixed-variant: '#900138'
  secondary-fixed: '#f4dde4'
  secondary-fixed-dim: '#d7c1c8'
  on-secondary-fixed: '#24181d'
  on-secondary-fixed-variant: '#524348'
  tertiary-fixed: '#88faa7'
  tertiary-fixed-dim: '#6bdd8d'
  on-tertiary-fixed: '#00210c'
  on-tertiary-fixed-variant: '#005227'
  background: '#fff7fa'
  on-background: '#1e1b1d'
  surface-variant: '#e8e1e3'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 56px
    fontWeight: '300'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 38px
    fontWeight: '300'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: 0em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0.01em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  metadata-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.06em
  metadata-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.08em
  button:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
spacing:
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  space-3xl: 4.5rem
  space-4xl: 6rem
  gutter-mobile: 1rem
  gutter-desktop: 2rem
  container-max: 1360px
---

## Brand & Style

This design system delivers a high-fashion, editorial aesthetic tailored for an avant-garde hair salon and creative studio. It shifts away from generic boutique tropes in favor of an architectural, print-editorial perspective: quiet confidence, generous breathing room, precise grid alignments, and exacting typographic hierarchy.

The aesthetic fuses **Editorial Minimalism** with disciplined architectural layout. Tactility is conveyed through subtle tonal contrasts, 1px structural hairline borders, and sharp photographic presentation rather than synthetic depth or heavy drop shadows. Micro-accents in vivid salon rose puncture an otherwise serene palette of bleached bone, chalk white, and deep charcoal.

- **Tone & Mood:** Curated, serene, clinical yet tactile, effortless luxury.
- **Visual Tenets:** Hairline rules over shadows, deliberate asymmetry counterbalanced by rigorous baseline grids, monospaced functional metadata against fluid modern grotesque display headings.

## Colors

The palette inverts traditional high-contrast dark fashion identities into a light-flooded editorial format.

### Roles & Tokens
- **Canvas / Background (`#F5F3F3`):** Muted bone tint serving as the holistic field, preventing the glare of stark pure white while holding structure.
- **Surface / Card (`#FFFFFF`):** Reserved for elevated panels, modular cards, service tiles, and modal layers.
- **Primary Text (`#201D1F`):** Deep volcanic charcoal for headlines, titles, and active interface elements. Never use absolute `#000000`.
- **Secondary Text / Muted (`#777174`):** Soft slate stone for body text, secondary captions, pricing details, and deselect states.
- **Border / Hairline Dividers (`#DED8DB`):** Restrained, 1px structural boundaries defining the architectural grid.
- **Accent Rose (`#D9446A`):** The deliberate injection of energy—used strictly for focal points, high-priority interactive states, book-now triggers, and active selectors.
- **Soft Pink Surface (`#F8E1E8`):** Gentle wash utilized for tags, chips, status pills, and subtle contextual selections.

Interactive states adhere strictly to opacity shifts and border weight definition rather than luminance spikes.

## Typography

Typography establishes tension between the geometric humanism of **Plus Jakarta Sans** and the strict, technical utilitarianism of **JetBrains Mono**.

- **Display & Headlines:** Set in light and regular weights of Plus Jakarta Sans with tighter tracking to evoke a bespoke magazine feel. Display sizes should embrace negative space and asymmetry.
- **Editorial Metadata & Utilities:** Timestamps, price figures, duration tags, service codes, and table specs must always be styled in JetBrains Mono (`metadata-md` or `metadata-sm`) in uppercase to mimic atelier specification tickets.
- **Body:** Open, legible line-heights ensuring high editorial readability against subtle neutral tones.

## Layout & Spacing

The spatial architecture is grounded in a 4px base module organized into an asymmetrical 12-column grid system.

- **Grid Discipline:** 12 columns on desktop (min-width 1024px) with 32px gutters and 48px margins. 4 columns on mobile with 16px gutters and 20px margins.
- **Editorial Whitespace:** Generous vertical intervals (`space-3xl` and `space-4xl`) delineate primary sections. Content density should remain relaxed, prioritizing rhythm and visual hierarchy over screen packing.
- **Modular Division:** Vertical borders (`1px solid #DED8DB`) often act as in-grid dividers between adjacent columns (e.g., service list against booking summary), echoing print newspaper columns and architectural drafts.

## Elevation & Depth

This system intentionally rejects SaaS drop shadows, blurs, and skeuomorphic layering.

- **Zero Diffusion:** Do not use diffused box shadows. Visual separation is accomplished solely through planar shifts (e.g., `#F5F3F3` canvas against `#FFFFFF` surfaces) and clean, 1px `#DED8DB` structural borders.
- **Floating Overlays (Modals & Drawers):** For floating elements, introduce depth strictly via a crisp 1px perimeter border (`#DED8DB`) over a high-opacity backdrop scrim (`#201D1F` at 25% opacity) and an optional hard-offset boundary: `box-shadow: 0 16px 32px -12px rgba(32, 29, 31, 0.08)`.
- **Card States:** Rather than lifting on hover via elevation shadows, interactive cards transition through a border-color shift from `#DED8DB` to `#201D1F` or `#D9446A`.

## Shapes

The shape system is strictly architectural and rectilinear (`roundedness: 0`).

- **Edges:** Buttons, cards, modals, dropdowns, input fields, and structural tags retain sharp 90-degree corners (`0px` border radius).
- **Exceptions:** Pill-rounded elements are permitted exclusively for mini status badges and category chips (`rounded-full`) to create intentional geometric contrast against the otherwise rigid rectangular framework.
- **Lines:** All dividers, horizontal rules, and segment borders must measure exactly 1px in stroke thickness.

## Components

### Buttons
- **Primary:** Solid `#201D1F` background, `#FFFFFF` text, sharp corners (`0px`). Padding: 14px 28px. On hover, transitions to `#D9446A`.
- **Secondary / Accent:** `#D9446A` background with `#FFFFFF` text for decisive salon booking actions. On hover, brightness reduces by 8%.
- **Outline:** 1px `#201D1F` border, transparent background, `#201D1F` text. On hover, inverts to `#201D1F` background with `#FFFFFF` text.
- **Text Link:** Underlined with 1px hairline offset, rendered with `button` typography and JetBrains Mono directional arrows (`->`).

### Chips & Badges
- **Status / Tag:** Sharp or pill-shaped, `#F8E1E8` background with `#D9446A` mono text (`metadata-sm`).
- **Filter Chip:** `#FFFFFF` background, 1px border `#DED8DB`, `#777174` text. When active: `#201D1F` background, `#FFFFFF` text, 1px border `#201D1F`.

### Inputs & Form Fields
- **Text Input:** Flat `#FFFFFF` surface with a bottom border or full 1px perimeter border in `#DED8DB`. No inner shadows. Height: 48px. Text is `#201D1F`. Placeholder in `#777174`. On focus: 1px outline in `#201D1F` or `#D9446A`.
- **Labels:** Set in `metadata-sm` JetBrains Mono, uppercase, positioned above the field with generous vertical margin.

### Checkboxes & Radio Buttons
- **Shape:** 16x16px squares with 0px radius.
- **Borders:** 1px `#DED8DB` resting; `#201D1F` when checked.
- **Indicator:** Solid `#201D1F` interior block with 3px internal inset padding.

### Cards & Service Units
- **Service Item Tile:** `#FFFFFF` surface with a 1px `#DED8DB` continuous border. Divided internally with hairline rules: title on the left, duration and price in `metadata-md` on the right.
- **Lookbook / Portfolio Card:** Unbordered photographic media container with full bleed imagery, accompanied underneath by mono metadata and hair artist attribution separated by a 1px horizontal rule.

### Atelier Add-ons (Specialized Components)
- **Time Slot Matrix:** Rectangular grid of mono-labeled time pills (`10:30`, `11:00`). Unavailable slots struck through with a 1px diagonal rule. Selected slot fills `#201D1F` with white mono typography.
- **Service Receipt Strip:** Emulates an unprinted thermal atelier slip. `#FFFFFF` background, 1px border, dotted interior divider lines (`1px dashed #DED8DB`), and complete monospaced service breakdowns.
## Final Product Revision

The exported screens are the source for development, not a luxury-studio concept board. Keep the editorial structure but use plain, human Indonesian copy and only information that helps a customer book or helps the kapster run today's agenda.

- All three services are exactly Rp50.000 and 60 menit.
- Do not invent addresses, coordinates, staff names, statistics, membership claims, or service prices.
- Use `Booking sekarang`, `Pilih layanan`, `Pilih waktu`, `Kunci booking`, `Ubah jadwal`, and `Batalkan booking` as direct action language.
- Replace atelier, ritual, accession, protocol, concierge, archive, and system-coded language with normal Indonesian.
- The main CTA is a soft rectangular button with a 12px radius. Do not use large circular CTA buttons or circular booking controls; those are reserved as a signature of the external OKC reference.
- Status dots may remain circular, but they are not buttons.
- The light theme must use the same layout, typography, spacing, pink accent, and component shapes as dark mode. Only surface and text colors change.
- The light theme must never inherit dark charcoal surfaces from the dark theme.
- Customer content is concise and personal: explain what the service is, when to arrive, how to pay, and what happens next.
- Admin content is operational: show time, customer, service, status, and the next action. Remove decorative metrics and unnecessary jargon.
- Use only text actions, simple dots, arrows, and structural rules. Do not load a generic icon library.
- Placeholder address and contact values must be visibly marked as placeholders until the owner supplies real values.
