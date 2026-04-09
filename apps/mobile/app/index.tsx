import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useWallet } from '../lib/wallet';

export default function Index() {
  const { isConnected, hydrated } = useWallet();
  if (!hydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a' }}>
        <ActivityIndicator color="#6366f1" />
      </View>
    );
  }
  return <Redirect href={isConnected ? '/(main)/dashboard' : '/ftue'} />;
}
