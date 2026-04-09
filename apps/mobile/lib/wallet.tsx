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
