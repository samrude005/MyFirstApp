import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { db } from '../../../../firebaseConfig'; // Make sure this path is correct
import { collection, onSnapshot, query } from 'firebase/firestore';

// Define the Task type (you did this correctly!)
interface Task {
  id: string;
  title: string;
  status: string;
  dueDate: string;
  completed: boolean;
};

// A reusable component for the list items
const TaskItem = ({ task }: { task: Task }) => (
  // I noticed a small bug in your Link href, I've corrected it here
  // It should probably navigate to the dynamic task page within the tasks stack
  <Link href={`/(app)/tabs/tasks/${task.id}`} asChild>
    <TouchableOpacity style={styles.taskItem}>
      <View style={styles.taskCheckbox}>
        {task.completed && <MaterialIcons name="check" size={20} color="white" />}
      </View>
      <View style={styles.taskDetails}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        <Text style={styles.taskMeta}>{task.status} • Due: {task.dueDate}</Text>
      </View>
    </TouchableOpacity>
  </Link>
);

export default function MaintenanceTasksScreen() {
  // THIS IS THE FIX:
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'tasks'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksData: Task[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        tasksData.push({
          id: doc.id,
          title: data.title || 'No Title',
          status: data.status || 'Unknown',
          dueDate: data.dueDate || 'N/A',
          completed: data.completed || false,
        });
      });
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Maintenance Tasks</Text>
      </View>
      <View style={styles.controls}>
        <View style={styles.searchContainer}>
          <FontAwesome name="search" size={16} color="#94A3B8" style={{marginRight: 8}} />
          <TextInput placeholder="Search tasks" placeholderTextColor="#94A3B8" style={styles.searchInput} />
        </View>
        <View style={styles.filters}>
            <TouchableOpacity style={styles.filterButton}><Text style={styles.filterText}>Status</Text></TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}><Text style={styles.filterText}>Due Date</Text></TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.listContainer}>
        {tasks.map(task => <TaskItem key={task.id} task={task} />)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0F172A' },
  header: { padding: 16, alignItems: 'center' },
  headerTitle: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  controls: { paddingHorizontal: 16, marginBottom: 16 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', borderRadius: 8, paddingHorizontal: 12, marginBottom: 12 },
  searchInput: { color: 'white', paddingVertical: 10, flex: 1 },
  filters: { flexDirection: 'row', justifyContent: 'flex-start', gap: 10 },
  filterButton: { backgroundColor: '#1E293B', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  filterText: { color: 'white' },
  listContainer: { flex: 1, paddingHorizontal: 16 },
  taskItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#007AFF', padding: 16, borderRadius: 12, marginBottom: 12 },
  taskCheckbox: { width: 24, height: 24, borderWidth: 2, borderColor: 'white', borderRadius: 6, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  taskDetails: { flex: 1 },
  taskTitle: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  taskMeta: { color: '#E0E0E0', fontSize: 14 },
});