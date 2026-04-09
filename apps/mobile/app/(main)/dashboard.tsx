import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Wallet,
  Building2 as BuildingIcon,
  Coins,
  History as HistoryIcon,
  Settings as SettingsIcon,
  LogOut,
} from 'lucide-react-native';
import { userPortfolio } from '@drei/shared';
import { useWallet } from '../../lib/wallet';

type TabId = 'portfolio' | 'transactions' | 'settings';

const transactions = [
  { id: 1, type: 'purchase', property: 'Luxury Downtown Apartment', tokens: 2, value: 1.0, date: '2023-06-15' },
  { id: 2, type: 'purchase', property: 'Beachfront Villa', tokens: 1, value: 1.2, date: '2023-05-22' },
  { id: 3, type: 'dividend', property: 'Luxury Downtown Apartment', tokens: 0, value: 0.05, date: '2023-04-01' },
  { id: 4, type: 'purchase', property: 'Urban Retail Space', tokens: 1, value: 0.67, date: '2023-03-10' },
];

export default function Dashboard() {
  const router = useRouter();
  const { isConnected, address, disconnectWallet } = useWallet();
  const [activeTab, setActiveTab] = useState<TabId>('portfolio');
  const [emailNotif, setEmailNotif] = useState(true);
  const [dividendNotif, setDividendNotif] = useState(true);

  if (!isConnected) {
    return (
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#0f172a' }}>
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-full max-w-sm items-center rounded-2xl border border-gray-700 bg-gray-800 p-8">
            <Wallet size={48} color="#818cf8" />
            <Text className="mt-4 text-center text-2xl font-semibold text-white">
              Wallet Not Connected
            </Text>
            <Text className="mt-3 text-center text-gray-300">
              Please connect your wallet to access your dashboard and portfolio.
            </Text>
            <Pressable
              onPress={() => router.replace('/ftue' as any)}
              className="mt-6 w-full items-center rounded-xl bg-indigo-500 py-3 active:bg-indigo-600"
            >
              <Text className="text-base font-semibold text-white">Back to Home</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const handleDisconnect = () => {
    disconnectWallet();
    router.replace('/ftue' as any);
  };

  const tabs: { id: TabId; label: string; Icon: typeof BuildingIcon }[] = [
    { id: 'portfolio', label: 'Portfolio', Icon: BuildingIcon },
    { id: 'transactions', label: 'Transactions', Icon: HistoryIcon },
    { id: 'settings', label: 'Settings', Icon: SettingsIcon },
  ];

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <Text className="mb-3 text-2xl font-bold text-white">My Dashboard</Text>

        <View className="mb-6 flex-row items-center gap-3">
          <View className="flex-row items-center gap-2 rounded-full border border-gray-700 bg-gray-800 px-3 py-2">
            <Wallet size={14} color="#6366f1" />
            <Text className="text-sm text-white">{address}</Text>
          </View>
        </View>

        {/* Stat cards */}
        <View className="mb-6 gap-3">
          <View className="rounded-xl border border-gray-700 bg-gray-800 p-5">
            <View className="mb-2 flex-row items-center gap-2">
              <BuildingIcon size={16} color="#9ca3af" />
              <Text className="text-gray-400">Properties Owned</Text>
            </View>
            <Text className="text-3xl font-bold text-indigo-400">
              {userPortfolio.totalProperties}
            </Text>
          </View>

          <View className="rounded-xl border border-gray-700 bg-gray-800 p-5">
            <View className="mb-2 flex-row items-center gap-2">
              <Coins size={16} color="#9ca3af" />
              <Text className="text-gray-400">Total Invested</Text>
            </View>
            <Text className="text-3xl font-bold text-indigo-400">
              {userPortfolio.totalInvested} ETH
            </Text>
          </View>

          <View className="rounded-xl border border-gray-700 bg-gray-800 p-5">
            <View className="mb-2 flex-row items-center gap-2">
              <HistoryIcon size={16} color="#9ca3af" />
              <Text className="text-gray-400">Last Transaction</Text>
            </View>
            <Text className="text-xl font-semibold text-indigo-400">2023-06-15</Text>
          </View>
        </View>

        {/* Segmented tabs */}
        <View className="mb-4 flex-row rounded-xl bg-gray-800 p-1">
          {tabs.map(({ id, label, Icon }) => {
            const active = activeTab === id;
            return (
              <Pressable
                key={id}
                onPress={() => setActiveTab(id)}
                className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-lg py-2.5 ${
                  active ? 'bg-indigo-500' : 'bg-gray-700'
                }`}
                style={{ marginHorizontal: 2 }}
              >
                <Icon size={14} color={active ? '#fff' : '#9ca3af'} />
                <Text className={`text-xs font-medium ${active ? 'text-white' : 'text-gray-400'}`}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {activeTab === 'portfolio' && (
          <View className="gap-3">
            {userPortfolio.properties.map((p) => (
              <Pressable
                key={p.propertyId}
                onPress={() => router.push(('/(main)/property/' + p.propertyId) as any)}
                className="flex-row items-center justify-between rounded-xl border border-gray-700 bg-gray-800 p-4 active:bg-gray-700"
              >
                <View className="flex-1 pr-3">
                  <Text className="font-medium text-white">{p.propertyName}</Text>
                  <Text className="mt-1 text-xs text-gray-400">{p.tokensOwned} tokens owned</Text>
                </View>
                <Text className="font-semibold text-indigo-400">
                  {p.investmentValue.toFixed(1)} ETH
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {activeTab === 'transactions' && (
          <View className="gap-3">
            {transactions.map((tx) => {
              const isPurchase = tx.type === 'purchase';
              return (
                <View
                  key={tx.id}
                  className="rounded-xl border border-gray-700 bg-gray-800 p-4"
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs text-gray-400">{tx.date}</Text>
                    <View
                      className={`rounded-full px-2 py-0.5 ${
                        isPurchase ? 'bg-indigo-500/20' : 'bg-emerald-500/20'
                      }`}
                    >
                      <Text
                        className={`text-xs font-medium ${
                          isPurchase ? 'text-indigo-400' : 'text-emerald-400'
                        }`}
                      >
                        {isPurchase ? 'Purchase' : 'Dividend'}
                      </Text>
                    </View>
                  </View>
                  <View className="mt-2 flex-row items-center justify-between">
                    <Text className="flex-1 pr-3 text-white">{tx.property}</Text>
                    <Text className="font-semibold text-indigo-400">
                      +{tx.value.toFixed(2)} ETH
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {activeTab === 'settings' && (
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
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
