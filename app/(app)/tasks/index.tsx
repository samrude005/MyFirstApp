import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';

// Dummy data for the list
const tasks = [
  { id: '123', title: 'Inspect HVAC System', status: 'Pending', dueDate: '07/20/2024', completed: false },
  { id: '124', title: 'Repair Leaky Faucet', status: 'In Progress', dueDate: '07/22/2024', completed: false },
  { id: '125', title: 'Replace Air Filter', status: 'Completed', dueDate: '07/18/2024', completed: true },
  { id: '126', title: 'Check Electrical Outlets', status: 'Pending', dueDate: '07/25/2024', completed: false },
  { id: '127', title: 'Clean Gutters', status: 'In Progress', dueDate: '07/23/2024', completed: false },
];

// Define the Task type
type Task = {
  id: string;
  title: string;
  status: string;
  dueDate: string;
  completed: boolean;
};

// A reusable component for the list items
const TaskItem = ({ task }: { task: Task }) => (
  <Link href={`./(tabs)/${task.id}`} asChild>
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
            {/* These would have dropdown menus in a real app */}
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