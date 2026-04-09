import React, { useMemo, useRef, useState } from 'react';
import { View, Text, TextInput, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { properties } from '@drei/shared';
import { PropertyCard } from '../../components/PropertyCard';
import { FilterSheet, FilterSheetHandle } from '../../components/FilterSheet';
import { applyFilters, defaultFilters, isActive, uniqueLocations, Filters } from '../../lib/filters';

export default function Browse() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const sheetRef = useRef<FilterSheetHandle>(null);
  const listRef = useRef<FlatList>(null);

  const locations = useMemo(() => uniqueLocations(properties), []);
  const filtered = useMemo(() => applyFilters(properties, filters, query), [filters, query]);
  const active = isActive(filters);

  const handleApply = (f: Filters) => {
    setFilters(f);
    sheetRef.current?.dismiss();
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <Text className="px-4 pb-3 pt-2 text-2xl font-bold text-white">Browse</Text>
      <View className="flex-row items-center gap-3 px-4 pb-3 pt-2">
        <View className="flex-1 flex-row items-center gap-2 rounded-xl bg-gray-800 px-3 py-3">
          <Search size={18} color="#9ca3af" />
          <TextInput
            className="flex-1 text-white"
            placeholder="Search properties or locations"
            placeholderTextColor="#6b7280"
            value={query}
            onChangeText={setQuery}
          />
        </View>
        <Pressable
          onPress={() => sheetRef.current?.present()}
          className="rounded-xl bg-gray-800 p-3"
        >
          <View>
            <SlidersHorizontal size={20} color="#fff" />
            {active && (
              <View className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-indigo-500" />
            )}
          </View>
        </Pressable>
      </View>

      <FlatList
        ref={listRef}
        data={filtered}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <PropertyCard property={item} />}
        ListEmptyComponent={
          <View className="items-center rounded-2xl bg-gray-800 p-12">
            <Text className="mb-2 text-lg font-semibold text-white">No properties found</Text>
            <Text className="mb-4 text-gray-400">Try adjusting your search criteria</Text>
            <Pressable
              className="rounded-lg bg-indigo-500 px-4 py-2"
              onPress={() => {
                setQuery('');
                setFilters(defaultFilters);
              }}
            >
              <Text className="text-white">Reset filters</Text>
            </Pressable>
          </View>
        }
      />

      <FilterSheet ref={sheetRef} value={filters} locations={locations} onApply={handleApply} />
    </SafeAreaView>
  );
}
