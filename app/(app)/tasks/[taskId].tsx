import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

export default function TaskDetailsScreen() {
  const { taskId } = useLocalSearchParams(); // Gets the ID from the URL
  const router = useRouter(); // Hook to control navigation

  return (
    <SafeAreaView style={styles.safeArea}>
       <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Details</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.detailsCard}>
          <Text style={styles.taskID}>Task ID: #{taskId}</Text>
          <Text style={styles.taskTitle}>Replace faulty HVAC filter</Text>
          {/* Add other details like Assigned To, Due Date etc. here */}
        </View>

        <Text style={styles.sectionTitle}>History</Text>
        {/* The history section would be a list of components in a real app */}
        <View style={styles.historyItem}>
            <Text style={styles.historyText}>Task Created</Text>
            <Text style={styles.historyDate}>2024-07-26 10:00 AM</Text>
        </View>

        <Text style={styles.sectionTitle}>Comments</Text>
        {/* The comments section */}
        <View style={styles.commentItem}>
            <Text style={styles.commentUser}>Ethan Carter</Text>
            <Text style={styles.commentText}>Started working on the filter replacement.</Text>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Edit Task</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Update Status</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#0F172A' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
    headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
    container: { paddingHorizontal: 16 },
    detailsCard: { backgroundColor: '#1E293B', borderRadius: 12, padding: 16, marginBottom: 24 },
    taskID: { color: '#94A3B8', fontSize: 14 },
    taskTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', marginVertical: 8 },
    sectionTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
    historyItem: { marginBottom: 8 },
    historyText: { color: 'white' },
    historyDate: { color: '#94A3B8' },
    commentItem: { marginBottom: 12 },
    commentUser: { color: 'white', fontWeight: 'bold' },
    commentText: { color: '#E0E0E0' },
    footer: { flexDirection: 'row', justifyContent: 'space-around', padding: 16, borderTopWidth: 1, borderTopColor: '#1E293B' },
    button: { backgroundColor: '#007AFF', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 8 },
    buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});