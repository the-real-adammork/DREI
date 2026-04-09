import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View, Text, Pressable, Image, Modal, TouchableWithoutFeedback } from 'react-native';
import { Wallet as WalletIcon } from 'lucide-react-native';

export type WalletConnectSheetHandle = {
  present: () => void;
  dismiss: () => void;
};

type Props = { onConnect: () => void };

export const WalletConnectSheet = forwardRef<WalletConnectSheetHandle, Props>(
  ({ onConnect }, ref) => {
    const [visible, setVisible] = useState(false);

    useImperativeHandle(ref, () => ({
      present: () => setVisible(true),
      dismiss: () => setVisible(false),
    }));

    return (
      <Modal
        transparent
        visible={visible}
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/70">
          <TouchableWithoutFeedback onPress={() => setVisible(false)}>
            <View className="flex-1" />
          </TouchableWithoutFeedback>
          <View className="rounded-t-3xl bg-gray-800 p-6 pb-10">
            <View className="mb-4 self-center h-1 w-10 rounded-full bg-gray-600" />
            <Text className="mb-6 text-xl font-semibold text-white">Connect Wallet</Text>

            <Pressable
              className="mb-3 flex-row items-center justify-between rounded-lg bg-gray-700 p-4 active:bg-gray-600"
              onPress={onConnect}
            >
              <View className="flex-row items-center">
                <Image
                  source={{
                    uri: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
                  }}
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
        </View>
      </Modal>
    );
  }
);

WalletConnectSheet.displayName = 'WalletConnectSheet';
