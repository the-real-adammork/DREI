# DREI Mobile App — Design

**Date:** 2026-04-08
**Status:** Approved (brainstorming)

## Summary

Port the DREI web demo's `/browse` and `/property/:id` functionality into a React Native mobile app built with Expo, plus a new 3-panel FTUE carousel with a persistent "Connect Wallet" call-to-action. Restructure the existing repo into an npm-workspaces monorepo so the web and mobile apps share `mockData.ts` and `types.ts` through a `@drei/shared` package. The wallet connection is mocked end-to-end (matching the current web behavior), so the entire build stays in Expo Go with no native modules.

## Goals

- Ship a working mobile demo that mirrors the web app's core browse + property detail experience on iOS and Android via Expo Go.
- Introduce a mobile-appropriate FTUE distinct from the web's navbar-only entry point.
- Establish a monorepo structure that lets web and mobile share data and types without duplicating them.
- Keep the existing web app running unchanged after the restructure.

## Non-Goals

- Real wallet SDK integration (Reown AppKit, wagmi, WalletConnect). Wallet remains mocked.
- Real backend/API integration. Mobile reads from shared mock data only.
- App Store or Play Store submission.
- Push notifications, deep links, share sheets, i18n, accessibility audit beyond basic contrast and tap-target hygiene.
- Automated tests for the mobile app in this pass (see Testing section for rationale).
- Android-specific tuning beyond "it runs in Expo Go".

## Repo Restructure

Convert the current flat DREI repo to an npm-workspaces monorepo. No Turborepo, no Nx — stdlib only.

```
DREI/
├─ package.json              # workspaces root
├─ server.js                 # unchanged Express server at root
├─ server/                   # unchanged
├─ netlify/                  # unchanged
├─ apps/
│  ├─ web/                   # current Vite app lives here
│  │  ├─ src/
│  │  ├─ public/
│  │  ├─ index.html
│  │  ├─ vite.config.js
│  │  ├─ tailwind.config.js
│  │  ├─ postcss.config.js
│  │  ├─ eslint.config.js
│  │  └─ package.json
│  └─ mobile/                # new Expo app
│     ├─ app/                # Expo Router file-based routes
│     ├─ lib/
│     ├─ components/
│     ├─ metro.config.js
│     ├─ babel.config.js
│     ├─ app.json
│     └─ package.json
└─ packages/
   └─ shared/
      ├─ src/
      │  ├─ index.ts
      │  ├─ types.ts         # moved from apps/web/src/utils/types.ts
      │  └─ mockData.ts      # moved from apps/web/src/utils/mockData.ts
      ├─ tsconfig.json
      └─ package.json
```

### Migration steps

1. Create `apps/web/` and move the Vite-specific files into it: `src/`, `public/`, `index.html`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `eslint.config.js`, and the corresponding dependencies split out into a new `apps/web/package.json`.
2. Leave `server.js`, `server/`, `netlify/`, and `.gitignore` at the repo root.
3. Create `packages/shared/` with `src/types.ts`, `src/mockData.ts`, `src/index.ts` (re-exports), `package.json` (name `@drei/shared`, `main`/`types` both `src/index.ts`, no build step), and a base `tsconfig.json`.
4. Move `apps/web/src/utils/types.ts` and `apps/web/src/utils/mockData.ts` into `packages/shared/src/` and delete the originals. Update the 5 import sites in the web app (`Home.tsx`, `Browse.tsx`, `PropertyDetail.tsx`, `Admin.tsx`, `User.tsx`) to import from `@drei/shared`.
5. Update the root `package.json` to declare `"workspaces": ["apps/*", "packages/*"]` and provide top-level scripts: `npm run web`, `npm run mobile`, `npm run server`, `npm run lint`.
6. Scaffold the mobile app: `npx create-expo-app@latest apps/mobile --template blank-typescript`. Add `@drei/shared` as a dependency (`"@drei/shared": "*"`).
7. Verify the web app still builds and runs unchanged.

### Shared package contract

- `packages/shared` exports raw TypeScript — no build step. Both Vite (web) and Metro (mobile) consume `src/` directly.
- `src/types.ts` contains `Property`, `UserPortfolio`, and any other interfaces, unchanged from the current web source.
- `src/mockData.ts` contains the `properties` array and `userPortfolio`, unchanged.
- Explicitly NOT shared: components, screens/pages, hooks, context. Web and mobile use different primitives (`div` vs `View`) and sharing JSX across them is out of scope.
- Future extension point: an `@drei/shared/api` module for a real axios client when the project grows past mocks.

## Mobile App

### Toolchain

- Expo SDK (latest), TypeScript template.
- Expo Router for file-based routing.
- NativeWind v4 for styling (Tailwind-for-RN, lets us port Tailwind class strings from the web with minor adjustments).
- `lucide-react-native` for icons (drop-in replacement for the web's `lucide-react`).
- `react-native-reanimated` + `react-native-gesture-handler` for animations and gesture handling.
- `@gorhom/bottom-sheet` for filter and transaction sheets.
- `@react-native-async-storage/async-storage` for persisting mock wallet state.
- `expo-clipboard` for "copy contract address".

No native modules beyond what Expo Go already ships with. The app runs in Expo Go end-to-end.

### Visual direction

Mobile-native adaptation of the web look: same brand palette (dark `gray-900` background, indigo `#6366f1` accents) but with larger tap targets, iOS/Android-appropriate type scales, and native-feeling transitions via Reanimated instead of direct Framer ports. NativeWind makes this adaptation cheap because we reuse Tailwind tokens.

### Route structure

```
apps/mobile/app/
├─ _layout.tsx               # Root: WalletProvider, fonts, theme, GestureHandlerRootView
├─ index.tsx                 # Entry router: isConnected ? /browse : /ftue
├─ ftue.tsx                  # 3-panel carousel + persistent Connect CTA
└─ (main)/
   ├─ _layout.tsx            # Stack with header-right wallet chip
   ├─ browse.tsx             # Browse screen
   └─ property/[id].tsx      # Property detail
```

### Navigation flow

- Fresh launch → `app/index.tsx` reads persisted wallet state from AsyncStorage → `router.replace('/ftue')` or `router.replace('/(main)/browse')`.
- FTUE → tap "Connect Wallet" (or "Skip") → mock wallet sheet → on selection → `connectWallet()` → `router.replace('/(main)/browse')`.
- Browse → tap card → `router.push('/(main)/property/[id])`.
- Header wallet chip (only in `(main)` group) → tap → small menu with address + "Disconnect" → on disconnect → state cleared → `router.replace('/ftue')`.

### Wallet state (mock)

`apps/mobile/lib/wallet.tsx` provides a context with the same shape as the web's `WalletContext`:

```ts
{
  isConnected: boolean;
  address: string | null;
  connectWallet: () => void;   // sets isConnected=true, address='0x1234...5678'
  disconnectWallet: () => void;
}
```

Unlike the web, the mobile version persists `{ isConnected, address }` to AsyncStorage under key `@drei/wallet` and hydrates on mount. This prevents the user from being forced through the FTUE on every cold launch. The mock address matches the web (`0x1234...5678`).

## Screens

### FTUE (`app/ftue.tsx`)

Full-screen dark background. A horizontally-paged `FlatList` (snap-to-page, 3 items) fills the top ~75% of the screen. Pagination dots sit just above a fixed bottom region containing the persistent "Connect Wallet" primary button and a fine-print line "By connecting, you agree to Terms & Privacy". A "Skip" text button sits in the top-right of the screen.

**Panel content:**

| # | Headline | Body | Visual |
|---|---|---|---|
| 1 | Own real estate, on-chain. | Invest in curated, tokenized properties from your phone. | Hero image (luxury building, Unsplash) |
| 2 | How it works | Browse properties → Connect your wallet → Buy fractional tokens → Track returns. | 4-step icon list (lucide: `Search`, `Wallet`, `Coins`, `TrendingUp`) |
| 3 | Ready to start? | Connect your wallet to view the full catalog. | Large wallet icon illustration |

**Interactions:**
- Swipe between panels; dots update.
- Tap "Skip" → opens the mock wallet sheet immediately (Skip is a shortcut to connect; users cannot enter Browse without "connecting", matching the Q4 decision).
- Tap "Connect Wallet" on any panel → mock wallet sheet.

**Mock wallet sheet:** A `@gorhom/bottom-sheet` modal mirroring the web's `WalletConnectModal.tsx`:
- Two options: MetaMask and WalletConnect, with the same icons (MetaMask fox, generic wallet icon), same labels, same "Connect →" affordance, same terms line.
- Tapping either → `connectWallet()` → close sheet → `router.replace('/(main)/browse')`.

### Browse (`app/(main)/browse.tsx`)

**Layout:**
- Parent stack provides the header with title "Browse" and the wallet chip top-right.
- Sticky search bar at top: rounded input with search icon, placeholder "Search properties or locations".
- Filter icon button right of the search bar (`SlidersHorizontal`). Shows a small dot badge when any filter is active.
- Single-column scrollable list of `PropertyCard`s (mobile is 1-column; the web's 3-column grid does not carry over).

**PropertyCard (mobile):** A mobile port of `apps/web/src/components/ui/PropertyCard.tsx`. Full-width card with:
- Hero image (16:9), status badge overlay top-right (`Available` / `Sold Out` / `Coming Soon`).
- Title + location (`MapPin` icon + city).
- Price row: USD price and token price side-by-side.
- Progress bar: tokens sold / total tokens.
- Return-rate pill.
- Pressable → `router.push('/(main)/property/[id]')`.

**Filter bottom sheet:** `@gorhom/bottom-sheet` with a ~60% snap point.
- Drag handle, title "Filters", "Reset" text button.
- Status: segmented control (All / Available / Sold Out / Coming Soon).
- Min Price / Max Price: two numeric inputs side by side.
- Location: picker sourced from the unique first-segment of `property.location` (same derivation logic as `Browse.tsx:20-26`).
- Fixed "Apply" button at the bottom of the sheet.
- On Apply: runs filter logic, closes the sheet, scrolls the list to top.

**Filter logic:** Ported verbatim from the web (`Browse.tsx:28-68`). Same search-by-title/location, same status/min/max/location rules. Filter state lives in the component; no global store needed.

**Empty state:** "No properties found" + "Reset filters" button, matching the web.

### Property Detail (`app/(main)/property/[id].tsx`)

Scrollable layout with a sticky footer CTA:

1. **Hero** — full-width 16:9 image. Back chevron top-left (transparent over image). Status badge top-right of image.
2. **Title block** — large title; location row (`MapPin` + city, state); return-rate pill (`TrendingUp` + "8.2% APY").
3. **Price card** — two-up: "Property Value" ($450,000) and "Token Price" (0.5 ETH) in a dark rounded card.
4. **Token progress** — "650 / 1000 tokens sold" + horizontal progress bar.
5. **Features** — 2-column grid of feature pills (`Check` icon prefix).
6. **Description** — paragraph text.
7. **Documents** — stacked list. Each row: `FileText` icon, name, `ChevronRight`. Tap shows a "Document preview coming soon" toast (web links are `#` placeholders anyway).
8. **Contract address** — label "Smart Contract" + truncated address (`0x1234...5678`) + copy icon → `expo-clipboard` + toast.
9. **Footer CTA (sticky)** — "Buy Tokens" primary button pinned at the bottom with safe-area padding. Disabled if `!isConnected` (defensive — FTUE gates this in practice).

**Transaction modal (mock buy flow):** Ported from the web's `TransactionModal.tsx`, rendered as a `@gorhom/bottom-sheet` modal.
- Number-of-tokens stepper (−/+ around a numeric field).
- Derived total cost in ETH and USD.
- Two-step flow: "Review" → "Confirm" → success screen with a Reanimated checkmark, then close.
- Fully mocked. No chain calls.

**Not-found state:** Centered "Property not found" + "Back to Browse" button, matching the web.

## Running the Apps

- `npm run web` (root) → runs `vite` in `apps/web` on port 3000.
- `npm run mobile` (root) → runs `expo start` in `apps/mobile`. Scan the QR code with Expo Go on iOS/Android to load on device.
- `npm run server` (root) → unchanged Express server from the current repo.

## Testing

No automated test suite for the mobile app in this pass. The logic that benefits most from unit tests is the filter logic, which is being lifted verbatim from the already-shipped web version. The mobile work is a UI port of mocked data; the cost of wiring Jest + RN Testing Library for three screens exceeds the value for a demo. If the filter logic later moves into `packages/shared` (a natural next step), that is where Jest tests belong.

### Manual acceptance criteria

1. Fresh install → FTUE carousel appears, 3 panels swipeable, Connect button always visible.
2. Tap Connect or Skip → wallet sheet with MetaMask and WalletConnect options → tap either → Browse screen.
3. Browse shows all mock properties; search filters live; filter sheet applies all 4 filters correctly; empty state renders and recovers.
4. Tap a card → property detail renders all sections; document rows show a toast on tap; copy-address works.
5. Tap "Buy Tokens" → mock transaction flow → success → back to detail.
6. Header wallet chip → Disconnect → returns to FTUE; persisted state cleared.
7. Kill app → reopen → still "connected" → lands directly on Browse.
8. Web app still builds and runs unchanged (`npm run web`).

## Risks

- **Metro workspace resolution.** Metro does not auto-resolve npm workspaces the way Vite does. `apps/mobile/metro.config.js` must declare `watchFolders` pointing at `packages/shared` and the monorepo root, and `resolver.nodeModulesPaths` must include the root `node_modules`. This is the most likely source of a "why can't I import @drei/shared" issue.
- **NativeWind v4 setup.** Requires a Babel plugin entry in `apps/mobile/babel.config.js` and a `tailwind.config.js` at `apps/mobile/`. Easy to forget and produces silent styling failures.
- **`@gorhom/bottom-sheet` prerequisites.** Needs `react-native-gesture-handler` imported at the very top of the root layout and wrapped in `GestureHandlerRootView`. Standard Expo practice but required.
- **Reanimated Babel plugin.** Must be the last entry in the Babel plugins list. Forgetting it breaks Reanimated animations at runtime.

## Open Questions

None at spec-approval time.
