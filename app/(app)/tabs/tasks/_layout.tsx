import { Stack } from 'expo-router';

export default function TasksStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[taskId]" />
    </Stack>
  );
}