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
