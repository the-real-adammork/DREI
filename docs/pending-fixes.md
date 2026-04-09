# Pending Fixes

Tracked issues to implement after current in-flight tasks complete.

## FTUE

### 1. First carousel card — heading + alignment
- **Add heading:** "Invest in Real Estate with Blockchain Technology" (pulled from the main marketing site) to the first FTUE carousel card.
- **Styling (from `apps/web/src/pages/Home.tsx:29-32`):**
  - `<h1>` — `text-4xl md:text-6xl font-bold text-white mb-6`
    - Mobile: `text-4xl` = 2.25rem / 36px, line-height 2.5rem / 40px
    - Desktop: `text-6xl` = 3.75rem / 60px, line-height 1
    - Weight: `font-bold` = 700
    - Color: `text-white` (#ffffff)
    - Bottom margin: `mb-6` = 1.5rem
  - Word "Blockchain" is wrapped in `<span className="text-indigo-400">` (#818cf8) as an accent — the rest of the phrase is white. Preserve this two-tone treatment on mobile.
  - Container is `text-center max-w-3xl mx-auto` — i.e. centered text, centered block.
  - Font family: inherits from marketing site global (no custom family on the h1). Use the mobile app's display/heading font; don't introduce a new one.
- **Mobile scale suggestion:** start around 32–36px bold, white, with the "Blockchain" accent in the app's indigo/primary. Tune to the carousel card width.
- **Alignment:** Content on the card is currently left- and top-aligned. Change to center-aligned both vertically and horizontally.
