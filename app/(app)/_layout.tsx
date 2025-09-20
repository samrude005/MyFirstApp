import { Stack, Tabs } from 'expo-router';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

export default function AppLayout() {
  return (
    // This Stack navigator allows us to push screens on top of the tabs.
    <Stack screenOptions={{ headerShown: false }}>
      {/* The main screen of this stack is the Tab navigator itself. */}
      <Stack.Screen name="tabs" />

      {/* This defines the complaint form screen as a modal that slides up. */}
      <Stack.Screen
        name="complaint"
        options={{
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}