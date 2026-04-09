# DREI Mobile App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship an Expo React Native app with a 3-panel FTUE, a Browse screen with filtering, and a Property Detail screen with a mock buy flow — all sharing `mockData`/`types` with the existing web app via a new `@drei/shared` workspace package.

**Architecture:** Convert DREI to an npm-workspaces monorepo (`apps/web`, `apps/mobile`, `packages/shared`). Mobile app uses Expo Router (file-based routing), NativeWind v4 (Tailwind for RN), `@gorhom/bottom-sheet` for filter + transaction modals, AsyncStorage for persisted mock wallet state. Wallet connection is entirely mocked; no real web3 SDKs. The app runs end-to-end in Expo Go.

**Tech Stack:** Expo SDK (latest), Expo Router, React Native, TypeScript, NativeWind v4, lucide-react-native, react-native-reanimated, react-native-gesture-handler, @gorhom/bottom-sheet, @react-native-async-storage/async-storage, expo-clipboard.

**Spec:** `docs/superpowers/specs/2026-04-08-drei-mobile-app-design.md`

---

## Task 1: Restructure repo as npm workspaces

**Files:**
- Create: `apps/web/` (moved from root)
- Create: `packages/shared/`
- Modify: `package.json` (root)
- Create: `apps/web/package.json`

- [ ] **Step 1: Create target dirs**

```bash
cd /Users/adam/Projects/DREI
mkdir -p apps/web apps/mobile packages/shared/src
```

- [ ] **Step 2: Move Vite app files into `apps/web/`**

```bash
git mv src apps/web/src
git mv public apps/web/public
git mv index.html apps/web/index.html
git mv vite.config.js apps/web/vite.config.js
git mv tailwind.config.js apps/web/tailwind.config.js
git mv postcss.config.js apps/web/postcss.config.js
git mv eslint.config.js apps/web/eslint.config.js
git mv wagmi.js apps/web/wagmi.js
```

Leave `server.js`, `server/`, `netlify/`, `.gitignore`, `README.md`, `.npmrc`, `package-lock.json` at the root.

- [ ] **Step 3: Write `apps/web/package.json`**

```json
{
  "name": "@drei/web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx,ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "@drei/shared": "*",
    "@rainbow-me/rainbowkit": "^2.2.8",
    "@tanstack/react-query": "^5.81.2",
    "autoprefixer": "^10.4.21",
    "axios": "^1.13.6",
    "framer-motion": "^11.5.4",
    "lucide-react": "^0.441.0",
    "normalize-url": "^8.1.0",
    "postcss": "^8.5.6",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0",
    "tailwindcss": "^3.4.0",
    "viem": "^2.31.4",
    "wagmi": "^2.15.6"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.3",
    "eslint": "^9.29.0",
    "vite": "^6.0.1"
  }
}
```

- [ ] **Step 4: Rewrite root `package.json` as workspace root**

```json
{
  "name": "drei",
  "version": "0.1.0",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "web": "npm run dev --workspace @drei/web",
    "mobile": "npm run start --workspace @drei/mobile",
    "server": "node server.js",
    "build:web": "npm run build --workspace @drei/web",
    "lint": "npm run lint --workspace @drei/web"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "config": "^3.3.3",
    "dotenv": "^16.4.5",
    "express": "^4.17.1",
    "express-validator": "^6.8.1",
    "gravatar": "^1.8.1",
    "jsonwebtoken": "^8.5.1",
    "mongoose": "^5.11.8",
    "request": "^2.88.2"
  },
  "devDependencies": {
    "npm-run-all": "^4.1.5",
    "patch-package": "^8.0.1"
  }
}
```

- [ ] **Step 5: Delete stale `apps/web/src/utils/mockData.ts` and `types.ts`** (they'll move to `packages/shared` in Task 2 — skip this step and do it there)

- [ ] **Step 6: Run `npm install` at the root**

```bash
cd /Users/adam/Projects/DREI
rm -rf node_modules package-lock.json
npm install
```

Expected: installs workspaces without errors.

- [ ] **Step 7: Verify web still builds**

```bash
npm run web
```

Expected: Vite starts on port 3000. Stop with Ctrl-C.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "refactor: restructure as npm workspaces monorepo"
```

---

## Task 2: Create `@drei/shared` package

**Files:**
- Create: `packages/shared/package.json`
- Create: `packages/shared/tsconfig.json`
- Create: `packages/shared/src/index.ts`
- Move: `apps/web/src/utils/mockData.ts` → `packages/shared/src/mockData.ts`
- Move: `apps/web/src/utils/types.ts` → `packages/shared/src/types.ts`
- Modify: `apps/web/src/pages/Home.tsx`, `Browse.tsx`, `PropertyDetail.tsx`, `Admin.tsx`, `User.tsx` (import paths)

- [ ] **Step 1: Write `packages/shared/package.json`**

```json
{
  "name": "@drei/shared",
  "version": "0.0.0",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "sideEffects": false
}
```

- [ ] **Step 2: Write `packages/shared/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Move `types.ts` and `mockData.ts`**

```bash
git mv apps/web/src/utils/types.ts packages/shared/src/types.ts
git mv apps/web/src/utils/mockData.ts packages/shared/src/mockData.ts
```

- [ ] **Step 4: Write `packages/shared/src/index.ts`**

```ts
export * from './types';
export * from './mockData';
```

- [ ] **Step 5: Update the 5 web import sites**

In `apps/web/src/pages/Home.tsx`, `Browse.tsx`, `PropertyDetail.tsx`, `Admin.tsx`, `User.tsx`: replace any import of `'../utils/mockData'` or `'../utils/types'` with `'@drei/shared'`.

Example — `Browse.tsx`:

```diff
-import { properties } from '../utils/mockData';
+import { properties } from '@drei/shared';
```

- [ ] **Step 6: Reinstall to link the workspace package**

```bash
npm install
```

- [ ] **Step 7: Verify web builds**

```bash
npm run web
```

Expected: Vite builds, app renders properties on `/browse` exactly as before.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: extract mockData and types into @drei/shared"
```

---

## Task 3: Scaffold Expo mobile app

**Files:**
- Create: `apps/mobile/` (via Expo template)
- Modify: `apps/mobile/package.json`
- Create: `apps/mobile/metro.config.js`
- Create: `apps/mobile/babel.config.js`
- Modify: `apps/mobile/tsconfig.json`

- [ ] **Step 1: Scaffold Expo app**

```bash
cd /Users/adam/Projects/DREI
npx create-expo-app@latest apps/mobile --template blank-typescript --yes
```

- [ ] **Step 2: Install runtime dependencies**

```bash
cd apps/mobile
npx expo install expo-router expo-linking expo-constants expo-status-bar expo-clipboard \
  react-native-safe-area-context react-native-screens react-native-gesture-handler \
  react-native-reanimated @react-native-async-storage/async-storage
npm install @drei/shared@* @gorhom/bottom-sheet lucide-react-native nativewind
npm install -D tailwindcss@3.4.0 prettier-plugin-tailwindcss
cd ../..
```

- [ ] **Step 3: Set entry point to Expo Router in `apps/mobile/package.json`**

Add / replace:

```json
{
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "ios": "expo start --ios",
    "android": "expo start --android"
  }
}
```

Also add under `expo`:

```json
{
  "expo": {
    "scheme": "drei",
    "plugins": ["expo-router"]
  }
}
```

(Merge into existing `app.json` expo config rather than `package.json` if the template split them.)

- [ ] **Step 4: Write `apps/mobile/metro.config.js`**

```js
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];
config.resolver.disableHierarchicalLookup = true;

module.exports = withNativeWind(config, { input: './global.css' });
```

- [ ] **Step 5: Write `apps/mobile/babel.config.js`**

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: ['react-native-reanimated/plugin'],
  };
};
```

Note: `react-native-reanimated/plugin` must be LAST.

- [ ] **Step 6: Write `apps/mobile/tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#6366f1',
          dark: '#4f46e5',
        },
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 7: Write `apps/mobile/global.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 8: Write `apps/mobile/nativewind-env.d.ts`**

```ts
/// <reference types="nativewind/types" />
```

- [ ] **Step 9: Update `apps/mobile/tsconfig.json`**

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", "nativewind-env.d.ts"]
}
```

- [ ] **Step 10: Smoke test — start Metro**

```bash
npm run mobile
```

Expected: Metro starts, QR code appears. Open in Expo Go → default template screen loads. Stop with Ctrl-C. (We'll replace the template in Task 4.)

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: scaffold Expo mobile app with NativeWind + Expo Router"
```

---

## Task 4: Wallet context + entry router

**Files:**
- Create: `apps/mobile/lib/wallet.tsx`
- Create: `apps/mobile/app/_layout.tsx`
- Create: `apps/mobile/app/index.tsx`
- Delete: `apps/mobile/App.tsx` (template file — Expo Router takes over)

- [ ] **Step 1: Delete template entry**

```bash
rm apps/mobile/App.tsx
```

- [ ] **Step 2: Write `apps/mobile/lib/wallet.tsx`**

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = '@drei/wallet';
const MOCK_ADDRESS = '0x1234...5678';

type WalletState = {
  isConnected: boolean;
  address: string | null;
  hydrated: boolean;
  connectWallet: () => void;
  disconnectWallet: () => void;
};

const WalletContext = createContext<WalletState | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as { isConnected: boolean; address: string | null };
          setIsConnected(parsed.isConnected);
          setAddress(parsed.address);
        }
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  const connectWallet = () => {
    setIsConnected(true);
    setAddress(MOCK_ADDRESS);
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ isConnected: true, address: MOCK_ADDRESS })
    );
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(null);
    AsyncStorage.removeItem(STORAGE_KEY);
  };

  return (
    <WalletContext.Provider
      value={{ isConnected, address, hydrated, connectWallet, disconnectWallet }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
}
```

- [ ] **Step 3: Write `apps/mobile/app/_layout.tsx`**

```tsx
import 'react-native-gesture-handler';
import '../global.css';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { StatusBar } from 'expo-status-bar';
import { WalletProvider } from '../lib/wallet';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <WalletProvider>
          <BottomSheetModalProvider>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0f172a' } }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="ftue" />
              <Stack.Screen name="(main)" />
            </Stack>
          </BottomSheetModalProvider>
        </WalletProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
```

- [ ] **Step 4: Write `apps/mobile/app/index.tsx`**

```tsx
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useWallet } from '../lib/wallet';

export default function Index() {
  const { isConnected, hydrated } = useWallet();
  if (!hydrated) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-900">
        <ActivityIndicator color="#6366f1" />
      </View>
    );
  }
  return <Redirect href={isConnected ? '/(main)/browse' : '/ftue'} />;
}
```

- [ ] **Step 5: Smoke test**

```bash
npm run mobile
```

Expected: Metro starts, device shows loading spinner briefly, then an error because `/ftue` doesn't exist yet. This is expected — we build it in Task 5.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(mobile): wallet context, root layout, entry router"
```

---

## Task 5: FTUE carousel screen

**Files:**
- Create: `apps/mobile/app/ftue.tsx`
- Create: `apps/mobile/components/WalletConnectSheet.tsx`

- [ ] **Step 1: Write `apps/mobile/components/WalletConnectSheet.tsx`**

```tsx
import React, { forwardRef, useMemo } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Wallet as WalletIcon, X } from 'lucide-react-native';

type Props = { onConnect: () => void };

export const WalletConnectSheet = forwardRef<BottomSheetModal, Props>(({ onConnect }, ref) => {
  const snapPoints = useMemo(() => ['55%'], []);

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      backgroundStyle={{ backgroundColor: '#1f2937' }}
      handleIndicatorStyle={{ backgroundColor: '#4b5563' }}
      backdropComponent={(props) => (
        <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.7} />
      )}
    >
      <View className="p-6">
        <Text className="mb-6 text-xl font-semibold text-white">Connect Wallet</Text>

        <Pressable
          className="mb-3 flex-row items-center justify-between rounded-lg bg-gray-700 p-4 active:bg-gray-600"
          onPress={onConnect}
        >
          <View className="flex-row items-center">
            <Image
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg' }}
              style={{ width: 32, height: 32, marginRight: 12 }}
            />
            <View>
              <Text className="font-medium text-white">MetaMask</Text>
              <Text className="text-sm text-gray-400">Popular</Text>
            </View>
          </View>
          <Text className="text-indigo-400">Connect →</Text>
        </Pressable>

        <Pressable
          className="flex-row items-center justify-between rounded-lg bg-gray-700 p-4 active:bg-gray-600"
          onPress={onConnect}
        >
          <View className="flex-row items-center">
            <View className="mr-3 h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
              <WalletIcon size={20} color="#fff" />
            </View>
            <View>
              <Text className="font-medium text-white">WalletConnect</Text>
              <Text className="text-sm text-gray-400">Universal</Text>
            </View>
          </View>
          <Text className="text-indigo-400">Connect →</Text>
        </Pressable>

        <Text className="mt-6 text-center text-sm text-gray-400">
          By connecting your wallet, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </BottomSheetModal>
  );
});

WalletConnectSheet.displayName = 'WalletConnectSheet';
```

- [ ] **Step 2: Write `apps/mobile/app/ftue.tsx`**

```tsx
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ImageBackground,
  Pressable,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Wallet, Coins, TrendingUp } from 'lucide-react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useWallet } from '../lib/wallet';
import { WalletConnectSheet } from '../components/WalletConnectSheet';

const { width } = Dimensions.get('window');

type Panel = {
  key: string;
  title: string;
  body: string;
  render: () => React.ReactNode;
};

const panels: Panel[] = [
  {
    key: 'own',
    title: 'Own real estate, on-chain.',
    body: 'Invest in curated, tokenized properties from your phone.',
    render: () => (
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80',
        }}
        className="h-72 w-full overflow-hidden rounded-3xl"
        imageStyle={{ borderRadius: 24 }}
      />
    ),
  },
  {
    key: 'how',
    title: 'How it works',
    body: 'Browse, connect, invest, and track returns — all in one app.',
    render: () => (
      <View className="gap-5">
        {[
          { Icon: Search, label: 'Browse tokenized properties' },
          { Icon: Wallet, label: 'Connect your wallet' },
          { Icon: Coins, label: 'Buy fractional tokens' },
          { Icon: TrendingUp, label: 'Track your returns' },
        ].map(({ Icon, label }) => (
          <View key={label} className="flex-row items-center gap-4">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-indigo-500/20">
              <Icon size={22} color="#6366f1" />
            </View>
            <Text className="flex-1 text-base text-white">{label}</Text>
          </View>
        ))}
      </View>
    ),
  },
  {
    key: 'ready',
    title: 'Ready to start?',
    body: 'Connect your wallet to view the full catalog.',
    render: () => (
      <View className="h-64 items-center justify-center">
        <View className="h-32 w-32 items-center justify-center rounded-full bg-indigo-500/20">
          <Wallet size={64} color="#6366f1" />
        </View>
      </View>
    ),
  },
];

export default function Ftue() {
  const router = useRouter();
  const { connectWallet } = useWallet();
  const sheetRef = useRef<BottomSheetModal>(null);
  const [index, setIndex] = useState(0);

  const openSheet = () => sheetRef.current?.present();

  const handleConnected = () => {
    connectWallet();
    sheetRef.current?.dismiss();
    router.replace('/(main)/browse');
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== index) setIndex(i);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900" edges={['top', 'bottom']}>
      <View className="flex-row justify-end px-6 pt-2">
        <Pressable onPress={openSheet} hitSlop={16}>
          <Text className="text-base text-gray-400">Skip</Text>
        </Pressable>
      </View>

      <FlatList
        data={panels}
        keyExtractor={(p) => p.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={{ width }} className="flex-1 px-6 pt-6">
            <View className="mb-8">{item.render()}</View>
            <Text className="mb-3 text-3xl font-bold text-white">{item.title}</Text>
            <Text className="text-base leading-6 text-gray-400">{item.body}</Text>
          </View>
        )}
      />

      <View className="flex-row justify-center gap-2 py-4">
        {panels.map((_, i) => (
          <View
            key={i}
            className={`h-2 rounded-full ${i === index ? 'w-6 bg-indigo-500' : 'w-2 bg-gray-700'}`}
          />
        ))}
      </View>

      <View className="px-6 pb-6">
        <Pressable
          className="items-center rounded-xl bg-indigo-500 py-4 active:bg-indigo-600"
          onPress={openSheet}
        >
          <Text className="text-base font-semibold text-white">Connect Wallet</Text>
        </Pressable>
        <Text className="mt-3 text-center text-xs text-gray-500">
          By connecting, you agree to Terms & Privacy
        </Text>
      </View>

      <WalletConnectSheet ref={sheetRef} onConnect={handleConnected} />
    </SafeAreaView>
  );
}
```

- [ ] **Step 3: Smoke test**

```bash
npm run mobile
```

Expected: FTUE loads, swipe through 3 panels, dots update, Skip and Connect both open the bottom sheet. Tapping MetaMask or WalletConnect attempts to navigate to `/(main)/browse` (errors until Task 6).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(mobile): FTUE carousel with mock wallet sheet"
```

---

## Task 6: (main) group layout with header wallet chip

**Files:**
- Create: `apps/mobile/app/(main)/_layout.tsx`
- Create: `apps/mobile/components/WalletChip.tsx`

- [ ] **Step 1: Write `apps/mobile/components/WalletChip.tsx`**

```tsx
import React, { useState } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Wallet } from 'lucide-react-native';
import { useWallet } from '../lib/wallet';

export function WalletChip() {
  const { address, disconnectWallet } = useWallet();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  if (!address) return null;

  const handleDisconnect = () => {
    disconnectWallet();
    setOpen(false);
    router.replace('/ftue');
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        className="flex-row items-center gap-2 rounded-full bg-gray-800 px-3 py-2"
      >
        <Wallet size={14} color="#6366f1" />
        <Text className="text-sm text-white">{address}</Text>
      </Pressable>

      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable className="flex-1 bg-black/50" onPress={() => setOpen(false)}>
          <View className="absolute right-4 top-16 w-52 rounded-xl border border-gray-700 bg-gray-800 p-4">
            <Text className="mb-1 text-xs uppercase text-gray-500">Connected</Text>
            <Text className="mb-4 text-sm text-white">{address}</Text>
            <Pressable
              className="rounded-lg bg-red-500/20 py-2 active:bg-red-500/30"
              onPress={handleDisconnect}
            >
              <Text className="text-center text-sm font-medium text-red-400">Disconnect</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
```

- [ ] **Step 2: Write `apps/mobile/app/(main)/_layout.tsx`**

```tsx
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { WalletChip } from '../../components/WalletChip';

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#0f172a' },
        headerTintColor: '#fff',
        headerTitleStyle: { color: '#fff' },
        contentStyle: { backgroundColor: '#0f172a' },
        headerRight: () => (
          <View style={{ marginRight: 12 }}>
            <WalletChip />
          </View>
        ),
      }}
    >
      <Stack.Screen name="browse" options={{ title: 'Browse' }} />
      <Stack.Screen name="property/[id]" options={{ title: 'Property' }} />
    </Stack>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(mobile): main group layout with wallet chip header"
```

---

## Task 7: Browse screen + PropertyCard

**Files:**
- Create: `apps/mobile/app/(main)/browse.tsx`
- Create: `apps/mobile/components/PropertyCard.tsx`
- Create: `apps/mobile/components/FilterSheet.tsx`
- Create: `apps/mobile/lib/filters.ts`

- [ ] **Step 1: Write `apps/mobile/lib/filters.ts`** (extracted filter logic — single source of truth; tests later if moved to shared)

```ts
import type { Property } from '@drei/shared';

export type Filters = {
  status: 'all' | 'Available' | 'Sold Out' | 'Coming Soon';
  minPrice: string;
  maxPrice: string;
  location: string;
};

export const defaultFilters: Filters = {
  status: 'all',
  minPrice: '',
  maxPrice: '',
  location: 'all',
};

export function applyFilters(properties: Property[], filters: Filters, query: string): Property[] {
  let result = [...properties];
  if (query) {
    const q = query.toLowerCase();
    result = result.filter(
      (p) => p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q)
    );
  }
  if (filters.status !== 'all') result = result.filter((p) => p.status === filters.status);
  if (filters.minPrice) result = result.filter((p) => p.price >= Number(filters.minPrice));
  if (filters.maxPrice) result = result.filter((p) => p.price <= Number(filters.maxPrice));
  if (filters.location !== 'all')
    result = result.filter((p) => p.location.includes(filters.location));
  return result;
}

export function isActive(filters: Filters): boolean {
  return (
    filters.status !== 'all' ||
    !!filters.minPrice ||
    !!filters.maxPrice ||
    filters.location !== 'all'
  );
}

export function uniqueLocations(properties: Property[]): string[] {
  return Array.from(
    new Set(
      properties
        .map((p) => p?.location?.split(',')[0]?.trim())
        .filter((l): l is string => !!l)
    )
  );
}
```

- [ ] **Step 2: Write `apps/mobile/components/PropertyCard.tsx`**

```tsx
import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, TrendingUp } from 'lucide-react-native';
import type { Property } from '@drei/shared';

export function PropertyCard({ property }: { property: Property }) {
  const router = useRouter();
  const pct = Math.round((property.tokensSold / property.totalTokens) * 100);

  const statusColor =
    property.status === 'Available'
      ? 'bg-emerald-500/20 text-emerald-400'
      : property.status === 'Sold Out'
      ? 'bg-red-500/20 text-red-400'
      : 'bg-amber-500/20 text-amber-400';

  return (
    <Pressable
      onPress={() => router.push(`/(main)/property/${property.id}`)}
      className="mb-5 overflow-hidden rounded-2xl bg-gray-800"
    >
      <View>
        <Image source={{ uri: property.imageUrl }} className="h-48 w-full" resizeMode="cover" />
        <View className={`absolute right-3 top-3 rounded-full px-3 py-1 ${statusColor.split(' ')[0]}`}>
          <Text className={`text-xs font-medium ${statusColor.split(' ')[1]}`}>{property.status}</Text>
        </View>
      </View>

      <View className="p-4">
        <Text className="mb-1 text-lg font-semibold text-white">{property.title}</Text>
        <View className="mb-3 flex-row items-center gap-1">
          <MapPin size={14} color="#9ca3af" />
          <Text className="text-sm text-gray-400">{property.location}</Text>
        </View>

        <View className="mb-3 flex-row justify-between">
          <View>
            <Text className="text-xs text-gray-500">Price</Text>
            <Text className="text-base font-semibold text-white">
              ${property.price.toLocaleString()}
            </Text>
          </View>
          <View>
            <Text className="text-xs text-gray-500">Token</Text>
            <Text className="text-base font-semibold text-white">{property.tokenPrice} ETH</Text>
          </View>
          <View className="flex-row items-center gap-1 self-end rounded-full bg-indigo-500/20 px-3 py-1">
            <TrendingUp size={12} color="#6366f1" />
            <Text className="text-xs font-medium text-indigo-400">{property.returnRate}%</Text>
          </View>
        </View>

        <View className="h-1.5 overflow-hidden rounded-full bg-gray-700">
          <View className="h-full rounded-full bg-indigo-500" style={{ width: `${pct}%` }} />
        </View>
        <Text className="mt-2 text-xs text-gray-500">
          {property.tokensSold} / {property.totalTokens} tokens sold
        </Text>
      </View>
    </Pressable>
  );
}
```

- [ ] **Step 3: Write `apps/mobile/components/FilterSheet.tsx`**

```tsx
import React, { forwardRef, useMemo, useState, useEffect } from 'react';
import { View, Text, Pressable, TextInput, ScrollView } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { Filters, defaultFilters } from '../lib/filters';

type Props = {
  value: Filters;
  locations: string[];
  onApply: (f: Filters) => void;
};

const statuses: Filters['status'][] = ['all', 'Available', 'Sold Out', 'Coming Soon'];

export const FilterSheet = forwardRef<BottomSheetModal, Props>(({ value, locations, onApply }, ref) => {
  const snapPoints = useMemo(() => ['75%'], []);
  const [local, setLocal] = useState<Filters>(value);

  useEffect(() => setLocal(value), [value]);

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      backgroundStyle={{ backgroundColor: '#1f2937' }}
      handleIndicatorStyle={{ backgroundColor: '#4b5563' }}
      backdropComponent={(props) => (
        <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.7} />
      )}
    >
      <BottomSheetView className="flex-1 px-6 pt-2">
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-xl font-semibold text-white">Filters</Text>
          <Pressable onPress={() => setLocal(defaultFilters)}>
            <Text className="text-indigo-400">Reset</Text>
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text className="mb-2 text-sm text-gray-400">Status</Text>
          <View className="mb-5 flex-row flex-wrap gap-2">
            {statuses.map((s) => (
              <Pressable
                key={s}
                onPress={() => setLocal({ ...local, status: s })}
                className={`rounded-full px-4 py-2 ${
                  local.status === s ? 'bg-indigo-500' : 'bg-gray-700'
                }`}
              >
                <Text className="text-sm text-white">{s === 'all' ? 'All' : s}</Text>
              </Pressable>
            ))}
          </View>

          <Text className="mb-2 text-sm text-gray-400">Price (USD)</Text>
          <View className="mb-5 flex-row gap-3">
            <TextInput
              className="flex-1 rounded-lg bg-gray-700 px-3 py-3 text-white"
              placeholder="Min"
              placeholderTextColor="#6b7280"
              keyboardType="numeric"
              value={local.minPrice}
              onChangeText={(t) => setLocal({ ...local, minPrice: t })}
            />
            <TextInput
              className="flex-1 rounded-lg bg-gray-700 px-3 py-3 text-white"
              placeholder="Max"
              placeholderTextColor="#6b7280"
              keyboardType="numeric"
              value={local.maxPrice}
              onChangeText={(t) => setLocal({ ...local, maxPrice: t })}
            />
          </View>

          <Text className="mb-2 text-sm text-gray-400">Location</Text>
          <View className="mb-6 flex-row flex-wrap gap-2">
            <Pressable
              onPress={() => setLocal({ ...local, location: 'all' })}
              className={`rounded-full px-4 py-2 ${
                local.location === 'all' ? 'bg-indigo-500' : 'bg-gray-700'
              }`}
            >
              <Text className="text-sm text-white">All</Text>
            </Pressable>
            {locations.map((loc) => (
              <Pressable
                key={loc}
                onPress={() => setLocal({ ...local, location: loc })}
                className={`rounded-full px-4 py-2 ${
                  local.location === loc ? 'bg-indigo-500' : 'bg-gray-700'
                }`}
              >
                <Text className="text-sm text-white">{loc}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <Pressable
          className="mb-4 items-center rounded-xl bg-indigo-500 py-4 active:bg-indigo-600"
          onPress={() => onApply(local)}
        >
          <Text className="text-base font-semibold text-white">Apply</Text>
        </Pressable>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

FilterSheet.displayName = 'FilterSheet';
```

- [ ] **Step 4: Write `apps/mobile/app/(main)/browse.tsx`**

```tsx
import React, { useMemo, useRef, useState } from 'react';
import { View, Text, TextInput, FlatList, Pressable } from 'react-native';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { properties } from '@drei/shared';
import { PropertyCard } from '../../components/PropertyCard';
import { FilterSheet } from '../../components/FilterSheet';
import { applyFilters, defaultFilters, isActive, uniqueLocations, Filters } from '../../lib/filters';

export default function Browse() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const sheetRef = useRef<BottomSheetModal>(null);
  const listRef = useRef<FlatList>(null);

  const locations = useMemo(() => uniqueLocations(properties), []);
  const filtered = useMemo(() => applyFilters(properties, filters, query), [filters, query]);
  const active = isActive(filters);

  const handleApply = (f: Filters) => {
    setFilters(f);
    sheetRef.current?.dismiss();
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  return (
    <View className="flex-1 bg-gray-900">
      <View className="flex-row items-center gap-3 px-4 pb-3 pt-2">
        <View className="flex-1 flex-row items-center gap-2 rounded-xl bg-gray-800 px-3 py-3">
          <Search size={18} color="#9ca3af" />
          <TextInput
            className="flex-1 text-white"
            placeholder="Search properties or locations"
            placeholderTextColor="#6b7280"
            value={query}
            onChangeText={setQuery}
          />
        </View>
        <Pressable
          onPress={() => sheetRef.current?.present()}
          className="rounded-xl bg-gray-800 p-3"
        >
          <View>
            <SlidersHorizontal size={20} color="#fff" />
            {active && (
              <View className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-indigo-500" />
            )}
          </View>
        </Pressable>
      </View>

      <FlatList
        ref={listRef}
        data={filtered}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <PropertyCard property={item} />}
        ListEmptyComponent={
          <View className="items-center rounded-2xl bg-gray-800 p-12">
            <Text className="mb-2 text-lg font-semibold text-white">No properties found</Text>
            <Text className="mb-4 text-gray-400">Try adjusting your search criteria</Text>
            <Pressable
              className="rounded-lg bg-indigo-500 px-4 py-2"
              onPress={() => {
                setQuery('');
                setFilters(defaultFilters);
              }}
            >
              <Text className="text-white">Reset filters</Text>
            </Pressable>
          </View>
        }
      />

      <FilterSheet ref={sheetRef} value={filters} locations={locations} onApply={handleApply} />
    </View>
  );
}
```

- [ ] **Step 5: Smoke test**

```bash
npm run mobile
```

Expected: FTUE → Connect → Browse shows properties, search filters live, filter sheet opens and applies all filters, active dot appears on filter button, empty state resets cleanly, wallet chip visible in header, disconnect returns to FTUE.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(mobile): browse screen with filter bottom sheet"
```

---

## Task 8: Property Detail screen + mock transaction sheet

**Files:**
- Create: `apps/mobile/app/(main)/property/[id].tsx`
- Create: `apps/mobile/components/TransactionSheet.tsx`

- [ ] **Step 1: Write `apps/mobile/components/TransactionSheet.tsx`**

```tsx
import React, { forwardRef, useMemo, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { Check, Minus, Plus } from 'lucide-react-native';
import type { Property } from '@drei/shared';

type Props = { property: Property };
type Stage = 'review' | 'confirm' | 'success';

export const TransactionSheet = forwardRef<BottomSheetModal, Props>(({ property }, ref) => {
  const snapPoints = useMemo(() => ['70%'], []);
  const [count, setCount] = useState(1);
  const [stage, setStage] = useState<Stage>('review');

  const totalEth = (count * property.tokenPrice).toFixed(2);
  const totalUsd = count * property.tokenPrice * 3000; // mock ETH rate

  const reset = () => {
    setCount(1);
    setStage('review');
  };

  const next = () => {
    if (stage === 'review') setStage('confirm');
    else if (stage === 'confirm') setStage('success');
  };

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      onDismiss={reset}
      backgroundStyle={{ backgroundColor: '#1f2937' }}
      handleIndicatorStyle={{ backgroundColor: '#4b5563' }}
      backdropComponent={(props) => (
        <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.7} />
      )}
    >
      <BottomSheetView className="flex-1 px-6 pt-2">
        {stage === 'success' ? (
          <View className="flex-1 items-center justify-center">
            <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20">
              <Check size={44} color="#10b981" />
            </View>
            <Text className="mb-2 text-2xl font-bold text-white">Purchase complete</Text>
            <Text className="text-center text-gray-400">
              {count} token{count !== 1 ? 's' : ''} of {property.title}
            </Text>
          </View>
        ) : (
          <>
            <Text className="mb-1 text-xl font-semibold text-white">
              {stage === 'review' ? 'Buy Tokens' : 'Confirm Purchase'}
            </Text>
            <Text className="mb-6 text-sm text-gray-400">{property.title}</Text>

            <Text className="mb-2 text-xs uppercase text-gray-500">Amount</Text>
            <View className="mb-6 flex-row items-center justify-center gap-6">
              <Pressable
                className="h-12 w-12 items-center justify-center rounded-full bg-gray-700"
                onPress={() => setCount((c) => Math.max(1, c - 1))}
                disabled={stage === 'confirm'}
              >
                <Minus size={20} color="#fff" />
              </Pressable>
              <Text className="w-16 text-center text-3xl font-bold text-white">{count}</Text>
              <Pressable
                className="h-12 w-12 items-center justify-center rounded-full bg-gray-700"
                onPress={() => setCount((c) => c + 1)}
                disabled={stage === 'confirm'}
              >
                <Plus size={20} color="#fff" />
              </Pressable>
            </View>

            <View className="mb-6 rounded-xl bg-gray-700/50 p-4">
              <View className="mb-2 flex-row justify-between">
                <Text className="text-gray-400">Total (ETH)</Text>
                <Text className="font-semibold text-white">{totalEth} ETH</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-400">Total (USD)</Text>
                <Text className="font-semibold text-white">
                  ${totalUsd.toLocaleString()}
                </Text>
              </View>
            </View>

            <Pressable
              className="items-center rounded-xl bg-indigo-500 py-4 active:bg-indigo-600"
              onPress={next}
            >
              <Text className="text-base font-semibold text-white">
                {stage === 'review' ? 'Review' : 'Confirm'}
              </Text>
            </Pressable>
          </>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

TransactionSheet.displayName = 'TransactionSheet';
```

- [ ] **Step 2: Write `apps/mobile/app/(main)/property/[id].tsx`**

```tsx
import React, { useRef } from 'react';
import { View, Text, Image, ScrollView, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import {
  MapPin,
  TrendingUp,
  FileText,
  ChevronRight,
  Copy,
  Check,
} from 'lucide-react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { properties } from '@drei/shared';
import { useWallet } from '../../../lib/wallet';
import { TransactionSheet } from '../../../components/TransactionSheet';

export default function PropertyDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isConnected } = useWallet();
  const txRef = useRef<BottomSheetModal>(null);
  const property = properties.find((p) => p.id === id);

  if (!property) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-900">
        <Text className="mb-4 text-xl text-white">Property not found</Text>
        <Pressable onPress={() => router.replace('/(main)/browse')}>
          <Text className="text-indigo-400">Back to Browse</Text>
        </Pressable>
      </View>
    );
  }

  const pct = Math.round((property.tokensSold / property.totalTokens) * 100);

  const copyAddress = async () => {
    await Clipboard.setStringAsync(property.contractAddress);
    Alert.alert('Copied', 'Contract address copied to clipboard');
  };

  return (
    <View className="flex-1 bg-gray-900">
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View>
          <Image source={{ uri: property.imageUrl }} className="h-72 w-full" resizeMode="cover" />
          <View className="absolute right-4 top-4 rounded-full bg-emerald-500/30 px-3 py-1">
            <Text className="text-xs font-medium text-emerald-300">{property.status}</Text>
          </View>
        </View>

        <View className="px-5 pt-5">
          <Text className="mb-1 text-2xl font-bold text-white">{property.title}</Text>
          <View className="mb-3 flex-row items-center gap-1">
            <MapPin size={14} color="#9ca3af" />
            <Text className="text-gray-400">{property.location}</Text>
          </View>
          <View className="mb-6 flex-row items-center gap-1 self-start rounded-full bg-indigo-500/20 px-3 py-1">
            <TrendingUp size={14} color="#6366f1" />
            <Text className="text-sm font-medium text-indigo-400">{property.returnRate}% APY</Text>
          </View>

          <View className="mb-5 flex-row gap-3">
            <View className="flex-1 rounded-xl bg-gray-800 p-4">
              <Text className="mb-1 text-xs text-gray-500">Property Value</Text>
              <Text className="text-lg font-bold text-white">
                ${property.price.toLocaleString()}
              </Text>
            </View>
            <View className="flex-1 rounded-xl bg-gray-800 p-4">
              <Text className="mb-1 text-xs text-gray-500">Token Price</Text>
              <Text className="text-lg font-bold text-white">{property.tokenPrice} ETH</Text>
            </View>
          </View>

          <View className="mb-6 rounded-xl bg-gray-800 p-4">
            <View className="mb-2 flex-row justify-between">
              <Text className="text-sm text-gray-400">Tokens sold</Text>
              <Text className="text-sm font-semibold text-white">
                {property.tokensSold} / {property.totalTokens}
              </Text>
            </View>
            <View className="h-2 overflow-hidden rounded-full bg-gray-700">
              <View className="h-full rounded-full bg-indigo-500" style={{ width: `${pct}%` }} />
            </View>
          </View>

          <Text className="mb-3 text-lg font-semibold text-white">Features</Text>
          <View className="mb-6 flex-row flex-wrap gap-2">
            {property.features.map((f) => (
              <View
                key={f}
                className="flex-row items-center gap-1 rounded-full border border-gray-700 px-3 py-2"
              >
                <Check size={12} color="#6366f1" />
                <Text className="text-sm text-white">{f}</Text>
              </View>
            ))}
          </View>

          <Text className="mb-3 text-lg font-semibold text-white">Description</Text>
          <Text className="mb-6 leading-6 text-gray-300">{property.description}</Text>

          <Text className="mb-3 text-lg font-semibold text-white">Documents</Text>
          <View className="mb-6 gap-2">
            {property.documents.map((d) => (
              <Pressable
                key={d.name}
                onPress={() => Alert.alert('Coming soon', 'Document preview coming soon')}
                className="flex-row items-center justify-between rounded-xl bg-gray-800 p-4"
              >
                <View className="flex-row items-center gap-3">
                  <FileText size={18} color="#6366f1" />
                  <Text className="text-white">{d.name}</Text>
                </View>
                <ChevronRight size={18} color="#6b7280" />
              </Pressable>
            ))}
          </View>

          <Text className="mb-2 text-xs uppercase text-gray-500">Smart Contract</Text>
          <Pressable
            onPress={copyAddress}
            className="flex-row items-center justify-between rounded-xl bg-gray-800 p-4"
          >
            <Text className="text-white">{property.contractAddress}</Text>
            <Copy size={16} color="#6366f1" />
          </Pressable>
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} className="absolute inset-x-0 bottom-0 bg-gray-900/95">
        <View className="px-5 pt-3">
          <Pressable
            disabled={!isConnected}
            onPress={() => txRef.current?.present()}
            className={`items-center rounded-xl py-4 ${
              isConnected ? 'bg-indigo-500 active:bg-indigo-600' : 'bg-gray-700'
            }`}
          >
            <Text className="text-base font-semibold text-white">Buy Tokens</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <TransactionSheet ref={txRef} property={property} />
    </View>
  );
}
```

- [ ] **Step 3: Smoke test end-to-end**

```bash
npm run mobile
```

Run through all 8 acceptance criteria from the spec:
1. Fresh install → FTUE
2. Connect or Skip → wallet sheet → Browse
3. Browse renders, filters work, empty state works
4. Tap card → detail renders, documents show toast, copy works
5. Buy Tokens → stepper → review → confirm → success
6. Wallet chip → disconnect → back to FTUE
7. Kill & reopen → lands on Browse
8. `npm run web` still works

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(mobile): property detail screen with mock transaction flow"
```

---

## Task 9: Final verification + docs

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Update root README**

Add a "Monorepo layout" section with:

```markdown
## Monorepo layout

- `apps/web/` — Vite + React web app (`npm run web`)
- `apps/mobile/` — Expo React Native app (`npm run mobile`)
- `packages/shared/` — shared `mockData` + `types` consumed by both
- `server.js`, `server/` — Express API (unused by mobile) (`npm run server`)

## Running

- Web: `npm run web` → http://localhost:3000
- Mobile: `npm run mobile` → scan QR with Expo Go
- API: `npm run server` → port 5025
```

- [ ] **Step 2: Final commit**

```bash
git add README.md
git commit -m "docs: update README for monorepo layout"
```

---

## Self-review notes

- **Spec coverage:** Tasks 1–2 cover repo restructure + shared package. Task 3 covers Expo toolchain (Q2, Q8, Q9). Task 4 covers wallet state + persistence (spec "Wallet state"). Task 5 covers FTUE (Q3 hybrid, Q4 post-connect, persistent CTA). Task 6 covers main group + wallet chip (Q7). Task 7 covers Browse + filter sheet (Q5 + filter parity). Task 8 covers Property Detail + mock buy flow (Q6 full parity). Task 9 docs. All 8 acceptance criteria exercised in Task 8 smoke test.
- **No placeholders:** Each step contains concrete file contents or exact commands.
- **Type consistency:** `Filters`, `defaultFilters`, `applyFilters` used identically in `filters.ts`, `browse.tsx`, and `FilterSheet.tsx`. `Property` comes from `@drei/shared` throughout. `WalletConnectSheet`, `FilterSheet`, `TransactionSheet` all use the `forwardRef<BottomSheetModal, Props>` pattern with matching `present()`/`dismiss()` calls at the call sites.
- **Risk mitigations (from spec):** Metro workspace config in Task 3 Step 4; NativeWind Babel + Tailwind config in Task 3 Steps 5–8; Reanimated plugin last in Babel config; `GestureHandlerRootView` at root in Task 4 Step 3.
