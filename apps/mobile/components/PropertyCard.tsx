import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, TrendingUp } from 'lucide-react-native';
import type { Property } from '@drei/shared';

export function PropertyCard({ property }: { property: Property }) {
  const router = useRouter();
  const pct = Math.round((property.tokensSold / property.totalTokens) * 100);

  const bgClass =
    property.status === 'Available'
      ? 'bg-emerald-500/20'
      : property.status === 'Sold Out'
      ? 'bg-red-500/20'
      : 'bg-amber-500/20';
  const textClass =
    property.status === 'Available'
      ? 'text-emerald-400'
      : property.status === 'Sold Out'
      ? 'text-red-400'
      : 'text-amber-400';

  return (
    <Pressable
      onPress={() => router.push(`/property/${property.id}` as any)}
      className="mb-5 overflow-hidden rounded-2xl bg-gray-800"
    >
      <View>
        <Image source={{ uri: property.imageUrl }} className="h-48 w-full" resizeMode="cover" />
        <View className={`absolute right-3 top-3 rounded-full px-3 py-1 ${bgClass}`}>
          <Text className={`text-xs font-medium ${textClass}`}>{property.status}</Text>
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
