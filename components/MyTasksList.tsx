import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext'; // Adjusted path
import { db } from '../firebaseConfig'; // Adjusted path
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';

// Define the shape of a task
interface Task {
  id: string;
  title: string;
  status: string;
}

// Helper function to determine the color of the status text
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return '#4CAF50'; // Green
    case 'in progress':
      return '#FFC107'; // Amber/Yellow
    case 'pending':
      return '#F44336'; // Red
    default:
      return '#FFFFFF'; // Default color
  }
};

const MyTasksList = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch the user's submitted tasks
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const tasksCollection = collection(db, 'tasks');
    const q = query(
      tasksCollection,
      where('createdBy', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userTasks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
      setTasks(userTasks);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [user]);

  // Render item for the FlatList
  const renderTaskItem = ({ item }: { item: Task }) => (
    <View style={styles.taskItem}>
      <View style={styles.taskIconContainer}>
        <MaterialIcons name="description" size={24} color="#A9B4C2" />
      </View>
      <View style={styles.taskDetails}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={styles.statusText}>
          Status: <Text style={{ color: getStatusColor(item.status) }}>{item.status}</Text>
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#fff" />;
  }

  return (
    <FlatList
      data={tasks}
      renderItem={renderTaskItem}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={<Text style={styles.emptyListText}>You have not submitted any tasks.</Text>}
    />
  );
};

// Styles are moved here from the profile screen
const styles = StyleSheet.create({
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A3858',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  taskIconContainer: {
    backgroundColor: '#394A7A',
    padding: 12,
    borderRadius: 10,
    marginRight: 15,
  },
  taskDetails: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    color: '#A9B4C2',
  },
  emptyListText: {
    textAlign: 'center',
    color: '#A9B4C2',
    marginTop: 20,
  }
});

export default MyTasksList;