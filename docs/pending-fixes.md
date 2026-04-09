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

## Missing screens

### 2. Port web `User.tsx` → mobile Dashboard screen
The web app has `apps/web/src/pages/User.tsx` (a full dashboard / portfolio view) that was never ported to mobile. The original mobile spec (`docs/superpowers/specs/2026-04-08-drei-mobile-app-design.md`) only scoped FTUE + Browse + PropertyDetail, but `userPortfolio` is already available from `@drei/shared` so the data side is ready.

**Scope — mirror `User.tsx` on mobile:**
- New route: `apps/mobile/app/(main)/dashboard.tsx` (or `user.tsx`). Add to the main group; wire up navigation (header chip menu item, or a tab if we move to a tab bar).
- Gate on `isConnected` — if not connected, show a "Wallet not connected" empty state with a button that routes back to FTUE.
- **Header block:** "My Dashboard" title + truncated wallet address pill + Disconnect button.
- **Stats cards (3):** Properties Owned (`userPortfolio.totalProperties`), Total Invested (`userPortfolio.totalInvested` ETH), Last Transaction (mock string). Stack vertically on mobile.
- **Tabs:** Portfolio / Transactions / Settings. Use a segmented control or simple tab row — no horizontal table; convert each row to a mobile card.
  - **Portfolio tab:** list of `userPortfolio.properties` — each card shows `propertyName`, `tokensOwned`, `investmentValue` ETH, tap → `/(main)/property/[id]`.
  - **Transactions tab:** mock transactions list (copy the four mock entries from `User.tsx:33-67`, or lift into `packages/shared` if we want parity with web). Each row: date, type badge (Purchase/Dividend), property, amount.
  - **Settings tab:** notification toggles (email / dividend), connected wallet display, Disconnect button.
- **Styling:** match the app's existing dark theme (`bg-gray-900` equivalent via NativeWind), indigo accent for values, gray-800 cards with gray-700 borders.
- **Icons:** use `lucide-react-native` equivalents of the web's `WalletIcon`, `CoinsIcon`, `HistoryIcon`, `BuildingIcon`, `SettingsIcon`, `LogOutIcon`.
- **Note:** tables in the web version need to become vertically-stacked cards on mobile — do NOT port the `<table>` markup.
- **Spec update:** when implementing, also amend `docs/superpowers/specs/2026-04-08-drei-mobile-app-design.md` to add this screen to the Route Structure and Screens sections so the spec reflects reality.
