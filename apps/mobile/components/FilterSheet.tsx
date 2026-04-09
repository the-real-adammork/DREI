import React, { forwardRef, useMemo, useState, useEffect } from 'react';
import { View, Text, Pressable, TextInput, ScrollView } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { Filters, defaultFilters } from '../lib/filters';

type Props = {
  value: Filters;
  locations: string[];
  onApply: (f: Filters) => void;
};

const statuses: Filters['status'][] = ['all', 'Available', 'Sold Out', 'Coming Soon'];

export const FilterSheet = forwardRef<BottomSheetModal, Props>(({ value, locations, onApply }, ref) => {
  const snapPoints = useMemo(() => ['75%'], []);
  const [local, setLocal] = useState<Filters>(value);

  useEffect(() => setLocal(value), [value]);

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
      <BottomSheetView className="flex-1 px-6 pt-2">
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-xl font-semibold text-white">Filters</Text>
          <Pressable onPress={() => setLocal(defaultFilters)}>
            <Text className="text-indigo-400">Reset</Text>
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text className="mb-2 text-sm text-gray-400">Status</Text>
          <View className="mb-5 flex-row flex-wrap gap-2">
            {statuses.map((s) => (
              <Pressable
                key={s}
                onPress={() => setLocal({ ...local, status: s })}
                className={`rounded-full px-4 py-2 ${
                  local.status === s ? 'bg-indigo-500' : 'bg-gray-700'
                }`}
              >
                <Text className="text-sm text-white">{s === 'all' ? 'All' : s}</Text>
              </Pressable>
            ))}
          </View>

          <Text className="mb-2 text-sm text-gray-400">Price (USD)</Text>
          <View className="mb-5 flex-row gap-3">
            <TextInput
              className="flex-1 rounded-lg bg-gray-700 px-3 py-3 text-white"
              placeholder="Min"
              placeholderTextColor="#6b7280"
              keyboardType="numeric"
              value={local.minPrice}
              onChangeText={(t) => setLocal({ ...local, minPrice: t })}
            />
            <TextInput
              className="flex-1 rounded-lg bg-gray-700 px-3 py-3 text-white"
              placeholder="Max"
              placeholderTextColor="#6b7280"
              keyboardType="numeric"
              value={local.maxPrice}
              onChangeText={(t) => setLocal({ ...local, maxPrice: t })}
            />
          </View>

          <Text className="mb-2 text-sm text-gray-400">Location</Text>
          <View className="mb-6 flex-row flex-wrap gap-2">
            <Pressable
              onPress={() => setLocal({ ...local, location: 'all' })}
              className={`rounded-full px-4 py-2 ${
                local.location === 'all' ? 'bg-indigo-500' : 'bg-gray-700'
              }`}
            >
              <Text className="text-sm text-white">All</Text>
            </Pressable>
            {locations.map((loc) => (
              <Pressable
                key={loc}
                onPress={() => setLocal({ ...local, location: loc })}
                className={`rounded-full px-4 py-2 ${
                  local.location === loc ? 'bg-indigo-500' : 'bg-gray-700'
                }`}
              >
                <Text className="text-sm text-white">{loc}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <Pressable
          className="mb-4 items-center rounded-xl bg-indigo-500 py-4 active:bg-indigo-600"
          onPress={() => onApply(local)}
        >
          <Text className="text-base font-semibold text-white">Apply</Text>
        </Pressable>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

FilterSheet.displayName = 'FilterSheet';
