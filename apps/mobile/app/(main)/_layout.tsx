import { Stack } from 'expo-router';
import { View } from 'react-native';
import { WalletChip } from '../../components/WalletChip';

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#0f172a' },
        headerTintColor: '#fff',
        headerTitleStyle: { color: '#fff' },
        contentStyle: { backgroundColor: '#0f172a' },
        headerRight: () => (
          <View style={{ marginRight: 12 }}>
            <WalletChip />
          </View>
        ),
      }}
    >
      <Stack.Screen name="browse" options={{ title: 'Browse' }} />
      <Stack.Screen name="property/[id]" options={{ title: 'Property' }} />
    </Stack>
  );
}
