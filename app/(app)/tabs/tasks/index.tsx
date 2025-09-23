import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { db } from '../../../../firebaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

// Updated Task interface to match your Firebase structure
interface Task {
  id: string;
  title: string;
  status: string;
  dueDate?: string;
  completed: boolean;
  description: string;
  location: string;
  type: string;
  createdBy: string;
  createdAt: any; // Firebase Timestamp
}

// Enhanced TaskItem component with better navigation
const TaskItem = ({ task }: { task: Task }) => (
  <Link href={`./tasks/${task.id}`} asChild>
    <TouchableOpacity style={styles.taskItem}>
      <View style={styles.taskCheckbox}>
        {task.completed && <MaterialIcons name="check" size={20} color="white" />}
      </View>
      <View style={styles.taskDetails}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        <Text style={styles.taskMeta}>{task.status} • Due: {task.dueDate || 'N/A'}</Text>
        {task.location && (
          <Text style={styles.taskLocation}>📍 {task.location}</Text>
        )}
      </View>
      <View style={styles.taskType}>
        <Text style={styles.typeText}>{task.type}</Text>
      </View>
    </TouchableOpacity>
  </Link>
);

export default function MaintenanceTasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Query with ordering by creation date (newest first)
    const q = query(
      collection(db, 'tasks'), 
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksData: Task[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        tasksData.push({
          id: doc.id,
          title: data.title || 'No Title',
          status: data.status || 'Unknown',
          dueDate: data.dueDate || null,
          completed: data.completed || false,
          description: data.description || '',
          location: data.location || '',
          type: data.type || 'Task',
          createdBy: data.createdBy || '',
          createdAt: data.createdAt,
        });
      });
      setTasks(tasksData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter tasks based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTasks(tasks);
    } else {
      const filtered = tasks.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTasks(filtered);
    }
  }, [tasks, searchQuery]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Maintenance Tasks</Text>
        </View>
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Loading tasks...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Maintenance Tasks</Text>
        <Text style={styles.taskCount}>{filteredTasks.length} tasks</Text>
      </View>
      
      <View style={styles.controls}>
        <View style={styles.searchContainer}>
          <FontAwesome name="search" size={16} color="#94A3B8" style={{marginRight: 8}} />
          <TextInput 
            placeholder="Search tasks" 
            placeholderTextColor="#94A3B8" 
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <View style={styles.filters}>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Status</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Due Date</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.listContainer}>
        {filteredTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No tasks found matching your search.' : 'No tasks available.'}
            </Text>
          </View>
        ) : (
          filteredTasks.map(task => <TaskItem key={task.id} task={task} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0F172A' },
  header: { padding: 16, alignItems: 'center' },
  headerTitle: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  taskCount: { color: '#94A3B8', fontSize: 14, marginTop: 4 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: 'white', fontSize: 16 },
  controls: { paddingHorizontal: 16, marginBottom: 16 },
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#1E293B', 
    borderRadius: 8, 
    paddingHorizontal: 12, 
    marginBottom: 12 
  },
  searchInput: { color: 'white', paddingVertical: 10, flex: 1 },
  filters: { flexDirection: 'row', justifyContent: 'flex-start', gap: 10 },
  filterButton: { backgroundColor: '#1E293B', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  filterText: { color: 'white' },
  listContainer: { flex: 1, paddingHorizontal: 16 },
  taskItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#007AFF', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 12 
  },
  taskCheckbox: { 
    width: 24, 
    height: 24, 
    borderWidth: 2, 
    borderColor: 'white', 
    borderRadius: 6, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 16 
  },
  taskDetails: { flex: 1 },
  taskTitle: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  taskMeta: { color: '#E0E0E0', fontSize: 14 },
  taskLocation: { color: '#B3D9FF', fontSize: 12, marginTop: 2 },
  taskType: { 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 12 
  },
  typeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  emptyState: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingVertical: 60 
  },
  emptyText: { color: '#94A3B8', fontSize: 16, textAlign: 'center' },
});
