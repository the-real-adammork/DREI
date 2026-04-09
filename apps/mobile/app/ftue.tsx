import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ImageBackground,
  Pressable,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Wallet, Coins, TrendingUp } from 'lucide-react-native';
import { useWallet } from '../lib/wallet';
import { WalletConnectSheet, WalletConnectSheetHandle } from '../components/WalletConnectSheet';

const { width } = Dimensions.get('window');

type Panel = {
  key: string;
  title: React.ReactNode;
  body: string;
  render: () => React.ReactNode;
  textFirst?: boolean;
};

const panels: Panel[] = [
  {
    key: 'own',
    title: (
      <>
        Invest in Real Estate with{' '}
        <Text className="text-indigo-400">Blockchain</Text> Technology
      </>
    ),
    body: 'Own fractions of premium properties with full transparency, liquidity, and security provided by blockchain technology.',
    render: () => (
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80',
        }}
        className="h-60 w-full overflow-hidden rounded-3xl"
        imageStyle={{ borderRadius: 24 }}
      />
    ),
  },
  {
    key: 'how',
    title: 'How it works',
    body: 'Browse, connect, invest, and track returns — all in one app.',
    textFirst: true,
    render: () => (
      <View className="gap-5">
        {[
          { Icon: Search, label: 'Browse tokenized properties' },
          { Icon: Wallet, label: 'Connect your wallet' },
          { Icon: Coins, label: 'Buy fractional tokens' },
          { Icon: TrendingUp, label: 'Track your returns' },
        ].map(({ Icon, label }) => (
          <View key={label} className="flex-row items-center gap-4">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-indigo-500/20">
              <Icon size={22} color="#6366f1" />
            </View>
            <Text className="flex-1 text-base text-white">{label}</Text>
          </View>
        ))}
      </View>
    ),
  },
  {
    key: 'ready',
    title: 'Ready to start?',
    body: 'Connect your wallet to view the full catalog.',
    render: () => (
      <View className="h-64 items-center justify-center">
        <View className="h-32 w-32 items-center justify-center rounded-full bg-indigo-500/20">
          <Wallet size={64} color="#6366f1" />
        </View>
      </View>
    ),
  },
];

export default function Ftue() {
  const router = useRouter();
  const { connectWallet } = useWallet();
  const sheetRef = useRef<WalletConnectSheetHandle>(null);
  const [index, setIndex] = useState(0);

  const openSheet = () => {
    console.log('[FTUE] openSheet called, ref=', sheetRef.current);
    sheetRef.current?.present();
  };

  const handleConnected = () => {
    connectWallet();
    sheetRef.current?.dismiss();
    router.replace('/(main)/portfolio' as any);
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== index) setIndex(i);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }} className="flex-1 bg-gray-900" edges={['top', 'bottom']}>
      <View className="flex-row justify-end px-6 pt-2">
        <Pressable onPress={openSheet} hitSlop={16}>
          <Text className="text-base text-gray-400">Skip</Text>
        </Pressable>
      </View>

      <FlatList
        data={panels}
        keyExtractor={(p) => p.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={{ width }} className="flex-1 items-center justify-center px-6">
            {item.textFirst ? (
              <>
                <Text className="mb-3 text-center text-3xl font-bold text-white">{item.title}</Text>
                <Text className="mb-8 text-center text-base leading-6 text-gray-400">
                  {item.body}
                </Text>
                <View className="w-full">{item.render()}</View>
              </>
            ) : (
              <>
                <View className="mb-8 w-full">{item.render()}</View>
                <Text className="mb-3 text-center text-3xl font-bold text-white">{item.title}</Text>
                <Text className="text-center text-base leading-6 text-gray-400">{item.body}</Text>
              </>
            )}
          </View>
        )}
      />

      <View className="flex-row justify-center gap-2 py-4">
        {panels.map((_, i) => (
          <View
            key={i}
            className={`h-2 rounded-full ${i === index ? 'w-6 bg-indigo-500' : 'w-2 bg-gray-700'}`}
          />
        ))}
      </View>

      <View className="px-6 pb-6">
        <Pressable
          className="items-center rounded-xl bg-indigo-500 py-4 active:bg-indigo-600"
          onPress={openSheet}
        >
          <Text className="text-base font-semibold text-white">Connect Wallet</Text>
        </Pressable>
        <Text className="mt-3 text-center text-xs text-gray-500">
          By connecting, you agree to Terms & Privacy
        </Text>
      </View>

      <WalletConnectSheet ref={sheetRef} onConnect={handleConnected} />
    </SafeAreaView>
  );
}
