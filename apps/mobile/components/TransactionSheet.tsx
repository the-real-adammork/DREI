import React, { forwardRef, useMemo, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { Check, Minus, Plus } from 'lucide-react-native';
import type { Property } from '@drei/shared';

type Props = { property: Property };
type Stage = 'review' | 'confirm' | 'success';

export const TransactionSheet = forwardRef<BottomSheetModal, Props>(({ property }, ref) => {
  const snapPoints = useMemo(() => ['70%'], []);
  const [count, setCount] = useState(1);
  const [stage, setStage] = useState<Stage>('review');

  const totalEth = (count * property.tokenPrice).toFixed(2);
  const totalUsd = count * property.tokenPrice * 3000;

  const reset = () => {
    setCount(1);
    setStage('review');
  };

  const next = () => {
    if (stage === 'review') setStage('confirm');
    else if (stage === 'confirm') setStage('success');
  };

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      onDismiss={reset}
      backgroundStyle={{ backgroundColor: '#1f2937' }}
      handleIndicatorStyle={{ backgroundColor: '#4b5563' }}
      backdropComponent={(props) => (
        <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.7} />
      )}
    >
      <BottomSheetView className="flex-1 px-6 pt-2">
        {stage === 'success' ? (
          <View className="flex-1 items-center justify-center">
            <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20">
              <Check size={44} color="#10b981" />
            </View>
            <Text className="mb-2 text-2xl font-bold text-white">Purchase complete</Text>
            <Text className="text-center text-gray-400">
              {count} token{count !== 1 ? 's' : ''} of {property.title}
            </Text>
          </View>
        ) : (
          <>
            <Text className="mb-1 text-xl font-semibold text-white">
              {stage === 'review' ? 'Buy Tokens' : 'Confirm Purchase'}
            </Text>
            <Text className="mb-6 text-sm text-gray-400">{property.title}</Text>

            <Text className="mb-2 text-xs uppercase text-gray-500">Amount</Text>
            <View className="mb-6 flex-row items-center justify-center gap-6">
              <Pressable
                className="h-12 w-12 items-center justify-center rounded-full bg-gray-700"
                onPress={() => setCount((c) => Math.max(1, c - 1))}
                disabled={stage === 'confirm'}
              >
                <Minus size={20} color="#fff" />
              </Pressable>
              <Text className="w-16 text-center text-3xl font-bold text-white">{count}</Text>
              <Pressable
                className="h-12 w-12 items-center justify-center rounded-full bg-gray-700"
                onPress={() => setCount((c) => c + 1)}
                disabled={stage === 'confirm'}
              >
                <Plus size={20} color="#fff" />
              </Pressable>
            </View>

            <View className="mb-6 rounded-xl bg-gray-700/50 p-4">
              <View className="mb-2 flex-row justify-between">
                <Text className="text-gray-400">Total (ETH)</Text>
                <Text className="font-semibold text-white">{totalEth} ETH</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-400">Total (USD)</Text>
                <Text className="font-semibold text-white">
                  ${totalUsd.toLocaleString()}
                </Text>
              </View>
            </View>

            <Pressable
              className="items-center rounded-xl bg-indigo-500 py-4 active:bg-indigo-600"
              onPress={next}
            >
              <Text className="text-base font-semibold text-white">
                {stage === 'review' ? 'Review' : 'Confirm'}
              </Text>
            </Pressable>
          </>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

TransactionSheet.displayName = 'TransactionSheet';
