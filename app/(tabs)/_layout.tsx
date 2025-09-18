import { Tabs } from 'expo-router';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'; // Import icon sets

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF', // Blue color for the active tab
        tabBarStyle: {
          backgroundColor: '#0F172A', // Dark blue for the tab bar
          borderTopColor: '#0F172A',
        },
      }}>
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          headerShown: false, // We will create our own header
          tabBarIcon: ({ color }) => <MaterialIcons name="qr-code-scanner" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="index" // This links to index.tsx
        options={{
          title: 'Dashboard',
          headerShown: false, // We will create our own header
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={28} color={color} />,
        }}
      />
       <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          headerShown: false, // We will create our own header
          tabBarIcon: ({ color }) => <FontAwesome name="check-square-o" size={24} color={color} />,
        }}
      />
       <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false, // We will create our own header
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}