import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Wallet,
  Building2 as BuildingIcon,
  Coins,
  History as HistoryIcon,
} from 'lucide-react-native';
import { userPortfolio } from '@drei/shared';
import { useWallet } from '../../lib/wallet';

export default function Portfolio() {
  const router = useRouter();
  const { address } = useWallet();

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <View className="mb-6 flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-white">Portfolio</Text>
          {address && (
            <Pressable
              onPress={() => router.push('/(main)/settings' as any)}
              className="flex-row items-center gap-2 rounded-full border border-gray-700 bg-gray-800 px-3 py-2 active:bg-gray-700"
            >
              <Wallet size={14} color="#6366f1" />
              <Text className="text-sm text-white">{address}</Text>
            </Pressable>
          )}
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

        <Text className="mb-3 text-lg font-semibold text-white">My Properties</Text>
        <View className="gap-3">
          {userPortfolio.properties.map((p) => (
            <Pressable
              key={p.propertyId}
              onPress={() =>
                router.push(
                  ('/(main)/property/' + p.propertyId + '?from=portfolio') as any
                )
              }
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
      </ScrollView>
    </SafeAreaView>
  );
}
