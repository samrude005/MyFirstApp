import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FontAwesome name="key" size={40} color="#007AFF" style={{ marginBottom: 24 }} />
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to manage your maintenance tasks.</Text>

        <TextInput
          placeholder="Username/Email"
          placeholderTextColor="#94A3B8"
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#94A3B8"
          style={styles.input}
          secureTextEntry
        />

        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <Link href="/(app)" asChild>
            <TouchableOpacity>
                <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#0F172A' },
    container: { flex: 1, justifyContent: 'center', padding: 16 },
    title: { color: 'white', fontSize: 32, fontWeight: 'bold', textAlign: 'center' },
    subtitle: { color: '#94A3B8', fontSize: 16, textAlign: 'center', marginBottom: 32 },
    input: { backgroundColor: '#1E293B', color: 'white', padding: 16, borderRadius: 8, marginBottom: 16 },
    loginButton: { backgroundColor: '#007AFF', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 16 },
    loginButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    skipText: { color: '#007AFF', textAlign: 'center', marginTop: 24 }
});