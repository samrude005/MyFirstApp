import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    login(email, password);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* We use an inner view to handle padding and layout */}
        <View style={styles.innerContainer}>
          <FontAwesome name="key" size={40} color="#007AFF" style={{ marginBottom: 24, alignSelf: 'center' }} />
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to manage your maintenance tasks.</Text>

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0F172A' },
  container: {
    flex: 1,
    justifyContent: 'center', // This keeps the form centered vertically
  },
  innerContainer: {
    paddingHorizontal: 16, // We apply padding here now
  },
  title: { color: 'white', fontSize: 32, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { color: '#94A3B8', fontSize: 16, textAlign: 'center', marginBottom: 32 },
  input: { backgroundColor: '#1E293B', color: 'white', padding: 16, borderRadius: 8, marginBottom: 16 },
  loginButton: { backgroundColor: '#007AFF', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  loginButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});