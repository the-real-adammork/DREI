import React, { forwardRef, useMemo } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Wallet as WalletIcon } from 'lucide-react-native';

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
