import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { db } from '../../../../firebaseConfig';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';

interface TaskData {
  id: string;
  title: string;
  description: string;
  status: string;
  completed: boolean;
  location: string;
  type: string;
  createdBy: string;
  createdAt: any; // Firebase Timestamp
}

export default function TaskDetailsScreen() {
  const { taskId } = useLocalSearchParams();
  const router = useRouter();
  
  const [taskData, setTaskData] = useState<TaskData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!taskId || typeof taskId !== 'string') {
      setError('Invalid task ID');
      setLoading(false);
      return;
    }

    // Set up real-time listener for the specific task
    const taskRef = doc(db, 'tasks', taskId);
    const unsubscribe = onSnapshot(
      taskRef,
      (documentSnapshot) => {
        if (documentSnapshot.exists()) {
          const data = documentSnapshot.data();
          setTaskData({
            id: documentSnapshot.id,
            title: data.title || 'Untitled Task',
            description: data.description || 'No description provided',
            status: data.status || 'Unknown',
            completed: data.completed || false,
            location: data.location || 'No location specified',
            type: data.type || 'Task',
            createdBy: data.createdBy || 'Unknown',
            createdAt: data.createdAt,
          });
        } else {
          setError('Task not found');
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching task:', error);
        setError('Failed to load task details');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [taskId]);

  // Format Firebase Timestamp for display
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown date';
    
    try {
      // Handle Firebase Timestamp
      if (timestamp.toDate && typeof timestamp.toDate === 'function') {
        const date = timestamp.toDate();
        return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      }
      // Handle regular Date object or timestamp
      const date = new Date(timestamp);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      }
      return 'Invalid date';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date format error';
    }
  };

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return '#22C55E';
      case 'pending': return '#F59E0B';
      case 'in progress': return '#3B82F6';
      case 'cancelled': return '#EF4444';
      default: return '#94A3B8';
    }
  };

  // Handle status update
  const updateTaskStatus = async () => {
    if (!taskData || !taskId) return;
    
    try {
      const taskRef = doc(db, 'tasks', taskId as string);
      const newStatus = taskData.status === 'Pending' ? 'In Progress' : 
                       taskData.status === 'In Progress' ? 'Completed' : 'Pending';
      
      await updateDoc(taskRef, {
        status: newStatus,
        completed: newStatus === 'Completed'
      });
      
      // The real-time listener will automatically update the UI
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Failed to update task status');
    }
  };

  if (loading) {
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
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading task details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !taskData) {
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
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => router.back()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
          <Text style={styles.taskID}>Task ID: #{taskData.id.substring(0, 8)}</Text>
          <Text style={styles.taskTitle}>{taskData.title}</Text>
          
          {/* Status Badge */}
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(taskData.status) }]}>
              <Text style={styles.statusText}>{taskData.status}</Text>
            </View>
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>
                {taskData.completed ? '✅ Completed' : '⏳ Not Completed'}
              </Text>
            </View>
          </View>

          {/* Task Details */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Description</Text>
            <Text style={styles.detailValue}>{taskData.description}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location</Text>
            <Text style={styles.detailValue}>📍 {taskData.location}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Type</Text>
            <Text style={styles.detailValue}>{taskData.type}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Created By</Text>
            <Text style={styles.detailValue}>{taskData.createdBy}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>History</Text>
        <View style={styles.historyItem}>
          <Text style={styles.historyText}>Task Created</Text>
          <Text style={styles.historyDate}>{formatDate(taskData.createdAt)}</Text>
        </View>
        
        {taskData.completed && (
          <View style={styles.historyItem}>
            <Text style={styles.historyText}>Task Completed</Text>
            <Text style={styles.historyDate}>Status changed to completed</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Comments</Text>
        <View style={styles.commentItem}>
          <Text style={styles.commentUser}>System</Text>
          <Text style={styles.commentText}>
            Task "{taskData.title}" created with {taskData.type} type at {taskData.location}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Edit Task</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: getStatusColor(taskData.status) }]}
          onPress={updateTaskStatus}
        >
          <Text style={styles.buttonText}>Update Status</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  container: { paddingHorizontal: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  loadingText: { color: 'white', marginTop: 16, fontSize: 16 },
  errorText: { color: '#EF4444', fontSize: 16, textAlign: 'center', marginBottom: 20 },
  retryButton: { backgroundColor: '#007AFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  retryButtonText: { color: 'white', fontWeight: 'bold' },
  detailsCard: { backgroundColor: '#1E293B', borderRadius: 12, padding: 16, marginBottom: 24 },
  taskID: { color: '#94A3B8', fontSize: 14 },
  taskTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', marginVertical: 8 },
  statusContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 12, gap: 8 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  statusText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  completedBadge: { backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  completedText: { color: 'white', fontSize: 10 },
  detailRow: { marginVertical: 8 },
  detailLabel: { color: '#94A3B8', fontSize: 14, fontWeight: '600', marginBottom: 4 },
  detailValue: { color: 'white', fontSize: 16, lineHeight: 22 },
  sectionTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 12, marginTop: 8 },
  historyItem: { backgroundColor: '#1E293B', padding: 12, borderRadius: 8, marginBottom: 8 },
  historyText: { color: 'white', fontWeight: 'bold' },
  historyDate: { color: '#94A3B8', fontSize: 12, marginTop: 2 },
  commentItem: { backgroundColor: '#1E293B', padding: 12, borderRadius: 8, marginBottom: 12 },
  commentUser: { color: 'white', fontWeight: 'bold', marginBottom: 4 },
  commentText: { color: '#E0E0E0', lineHeight: 18 },
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    padding: 16, 
    borderTopWidth: 1, 
    borderTopColor: '#1E293B' 
  },
  button: { backgroundColor: '#007AFF', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 8, flex: 0.45 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
});
