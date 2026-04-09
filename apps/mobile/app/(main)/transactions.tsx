import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const transactions = [
  { id: 1, type: 'purchase', property: 'Luxury Downtown Apartment', tokens: 2, value: 1.0, date: '2023-06-15' },
  { id: 2, type: 'purchase', property: 'Beachfront Villa', tokens: 1, value: 1.2, date: '2023-05-22' },
  { id: 3, type: 'dividend', property: 'Luxury Downtown Apartment', tokens: 0, value: 0.05, date: '2023-04-01' },
  { id: 4, type: 'purchase', property: 'Urban Retail Space', tokens: 1, value: 0.67, date: '2023-03-10' },
];

export default function Transactions() {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <Text className="mb-5 text-2xl font-bold text-white">Transactions</Text>

        <View className="gap-3">
          {transactions.map((tx) => {
            const isPurchase = tx.type === 'purchase';
            return (
              <View key={tx.id} className="rounded-xl border border-gray-700 bg-gray-800 p-4">
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
      </ScrollView>
    </SafeAreaView>
  );
}
