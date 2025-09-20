import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { db } from '../../firebaseConfig'; // Import db
import { useAuth } from '../../context/AuthContext'; // To get the current user
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function ComplaintFormScreen() {
      const router = useRouter();
      const { location } = useLocalSearchParams();
      const { user } = useAuth(); // Get the logged-in user

      const [subject, setSubject] = useState('');
      const [description, setDescription] = useState('');

      const handleSubmit = async () => {
        if (!subject || !description) {
          alert('Please fill out all fields.');
          return;
        }

        try {
          // Add a new document to the 'tasks' collection
          await addDoc(collection(db, 'tasks'), {
            title: subject,
            description: description,
            location: location,
            status: 'Pending', // Default status
            type: 'Complaint', // Differentiate from other tasks
            createdBy: user?.uid, // Link the task to the user
            createdAt: serverTimestamp(), // Use server's timestamp
            completed: false,
          });

          alert('Complaint submitted successfully!');
          router.back(); // Go back to the previous screen
        } catch (error) {
          console.error("Error adding document: ", error);
          alert('Failed to submit complaint.');
        }
      };

      return (
        <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>New Complaint Form</Text>
        </View>

        <View style={styles.locationInfo}>
          <Text style={styles.locationLabel}>Location from QR Code:</Text>
          <Text style={styles.locationText}>{location || 'No Location Scanned'}</Text>
        </View>

        <Text style={styles.label}>Subject</Text>
        <TextInput
          placeholder="e.g., Leaky Pipe, Broken Light"
          placeholderTextColor="#94A3B8"
          style={styles.input}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          placeholder="Please provide a detailed description of the issue."
          placeholderTextColor="#94A3B8"
          style={[styles.input, styles.multilineInput]}
          multiline
          numberOfLines={6}
        />

        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit Complaint</Text>
        </TouchableOpacity>

      </ScrollView>
      
    // ... SafeAreaView and ScrollView
        <TextInput
          placeholder="e.g., Leaky Pipe, Broken Light"
          style={styles.input}
          value={subject}
          onChangeText={setSubject}
        />
        <TextInput
          placeholder="Please provide a detailed description..."
          style={[styles.input, styles.multilineInput]}
          multiline
          value={description}
          onChangeText={setDescription}
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Complaint</Text>
        </TouchableOpacity>
        </SafeAreaView>
        // ...
      );
    }

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0F172A' },
  container: { flex: 1, padding: 16 },
  header: { alignItems: 'center', marginBottom: 24 },
  headerTitle: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  locationInfo: { backgroundColor: '#1E293B', padding: 12, borderRadius: 8, marginBottom: 24 },
  locationLabel: { color: '#94A3B8', fontSize: 14 },
  locationText: { color: 'white', fontSize: 18, fontWeight: 'bold', marginTop: 4 },
  label: { color: 'white', fontSize: 16, fontWeight: '500', marginBottom: 8 },
  input: { backgroundColor: '#1E293B', color: 'white', padding: 16, borderRadius: 8, marginBottom: 16, fontSize: 16 },
  multilineInput: { textAlignVertical: 'top', height: 120 },
  submitButton: { backgroundColor: '#007AFF', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  submitButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});