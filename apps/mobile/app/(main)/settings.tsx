import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut } from 'lucide-react-native';
import { useWallet } from '../../lib/wallet';

export default function Settings() {
  const router = useRouter();
  const { address, disconnectWallet } = useWallet();
  const [emailNotif, setEmailNotif] = useState(true);
  const [dividendNotif, setDividendNotif] = useState(true);

  const handleDisconnect = () => {
    disconnectWallet();
    router.replace('/ftue' as any);
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <Text className="mb-5 text-2xl font-bold text-white">Settings</Text>

        <View className="gap-6">
          <View className="rounded-xl border border-gray-700 bg-gray-800 p-5">
            <Text className="mb-4 text-base font-semibold text-white">Notifications</Text>
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-gray-300">Email notifications</Text>
              <Switch
                value={emailNotif}
                onValueChange={setEmailNotif}
                trackColor={{ false: '#374151', true: '#6366f1' }}
                thumbColor="#fff"
              />
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-300">Dividend alerts</Text>
              <Switch
                value={dividendNotif}
                onValueChange={setDividendNotif}
                trackColor={{ false: '#374151', true: '#6366f1' }}
                thumbColor="#fff"
              />
            </View>
          </View>

          <View className="rounded-xl border border-gray-700 bg-gray-800 p-5">
            <Text className="mb-2 text-base font-semibold text-white">Wallet</Text>
            <Text className="text-sm text-gray-400">{address}</Text>
          </View>

          <Pressable
            onPress={handleDisconnect}
            className="flex-row items-center justify-center gap-2 rounded-xl bg-red-500/20 py-4 active:bg-red-500/30"
          >
            <LogOut size={16} color="#f87171" />
            <Text className="text-base font-semibold text-red-400">Disconnect Wallet</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
