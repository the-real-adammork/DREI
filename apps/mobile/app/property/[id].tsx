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
  ChevronLeft,
  Briefcase,
} from 'lucide-react-native';
import { properties, userPortfolio } from '@drei/shared';
import { useWallet } from '../../lib/wallet';
import { TransactionSheet, TransactionSheetHandle } from '../../components/TransactionSheet';

export default function PropertyDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isConnected } = useWallet();
  const txRef = useRef<TransactionSheetHandle>(null);
  const property = properties.find((p) => p.id === id);

  if (!property) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-900">
        <Text className="mb-4 text-xl text-white">Property not found</Text>
        <Pressable onPress={() => router.replace('/(main)/browse' as any)}>
          <Text className="text-indigo-400">Back to Browse</Text>
        </Pressable>
      </View>
    );
  }

  const pct = Math.round((property.tokensSold / property.totalTokens) * 100);
  const holding = userPortfolio.properties.find((p) => p.propertyId === property.id);
  const owned = !!holding;

  const copyAddress = async () => {
    await Clipboard.setStringAsync(String(property.contractAddress));
    Alert.alert('Copied', 'Contract address copied to clipboard');
  };

  return (
    <View className="flex-1 bg-gray-900">
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View>
          <Image source={{ uri: property.imageUrl }} className="h-72 w-full" resizeMode="cover" />
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

          {owned && holding && (
            <View className="mb-5 rounded-xl border border-indigo-500/40 bg-indigo-500/10 p-4">
              <View className="mb-3 flex-row items-center gap-2">
                <Briefcase size={14} color="#818cf8" />
                <Text className="text-xs font-semibold uppercase tracking-wide text-indigo-300">
                  You own this
                </Text>
              </View>
              <View className="flex-row justify-between">
                <View>
                  <Text className="text-xs text-gray-400">Tokens owned</Text>
                  <Text className="mt-1 text-lg font-bold text-white">{holding.tokensOwned}</Text>
                </View>
                <View>
                  <Text className="text-xs text-gray-400">Invested</Text>
                  <Text className="mt-1 text-lg font-bold text-indigo-300">
                    {holding.investmentValue.toFixed(2)} ETH
                  </Text>
                </View>
                <View>
                  <Text className="text-xs text-gray-400">Est. yearly yield</Text>
                  <Text className="mt-1 text-lg font-bold text-emerald-400">
                    {((holding.investmentValue * (property.returnRate ?? 0)) / 100).toFixed(3)} ETH
                  </Text>
                </View>
              </View>
            </View>
          )}

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
            className="mb-6 flex-row items-center justify-between rounded-xl bg-gray-800 p-4"
          >
            <Text className="text-white">{property.contractAddress}</Text>
            <Copy size={16} color="#6366f1" />
          </Pressable>

        </View>
      </ScrollView>

      <SafeAreaView edges={['top']} className="absolute inset-x-0 top-0">
        <View className="flex-row items-center justify-between px-4 pt-2">
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full bg-black/60 active:bg-black/80"
          >
            <ChevronLeft size={22} color="#fff" />
          </Pressable>
          <View className="rounded-full bg-emerald-500/40 px-3 py-1">
            <Text className="text-xs font-medium text-emerald-200">{property.status}</Text>
          </View>
        </View>
      </SafeAreaView>

      <SafeAreaView edges={['bottom']} className="absolute inset-x-0 bottom-0 bg-gray-900/95">
        <View className="px-5 pt-3">
          <Pressable
            disabled={!isConnected}
            onPress={() => txRef.current?.present()}
            className={`items-center rounded-xl py-4 ${
              isConnected ? 'bg-indigo-500 active:bg-indigo-600' : 'bg-gray-700'
            }`}
          >
            <Text className="text-base font-semibold text-white">
              {owned ? 'Buy More Tokens' : 'Buy Tokens'}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <TransactionSheet ref={txRef} property={property} />
    </View>
  );
}
