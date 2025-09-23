import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { db } from '../../../firebaseConfig';
import { useAuth } from '../../../context/AuthContext';
import { collection, onSnapshot, query, where, orderBy, doc, getDoc } from 'firebase/firestore';
import SummaryCard from '../../../components/SummaryCard';
import MaintenanceItem from '../../../components/MaintenanceItem';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  type: string;
  location: string;
  createdBy: string;
  createdAt: any;
  completed: boolean;
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
}

interface UserProfile {
  role: 'student' | 'technical' | 'admin';
  displayName: string;
  department?: string;
}

interface DashboardStats {
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  overdueCount: number;
  myTasks: number;
  criticalIssues: number;
}

export default function DashboardScreen() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    overdueCount: 0,
    myTasks: 0,
    criticalIssues: 0
  });
  const [loading, setLoading] = useState(true);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);

  // Fetch user profile and role
  useEffect(() => {
    if (!user?.uid) return;

    const fetchUserProfile = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'userProfiles', user.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data() as UserProfile);
        } else {
          // Create default profile if doesn't exist
          setUserProfile({
            role: 'student', // Default role
            displayName: user.email?.split('@')[0] || 'User'
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Fallback to default
        setUserProfile({
          role: 'student',
          displayName: user.email?.split('@')[0] || 'User'
        });
      }
    };

    fetchUserProfile();
  }, [user]);

  // Fetch tasks based on user role
  useEffect(() => {
    if (!userProfile) return;

    let q;
    
    // Different queries based on user role
    switch (userProfile.role) {
      case 'admin':
        // Admin sees all tasks
        q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
        break;
      case 'technical':
        // Technical team sees all tasks except user's own complaints
        q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
        break;
      case 'student':
      default:
        // Students see only their own tasks
        q = query(
          collection(db, 'tasks'),
          where('createdBy', '==', user?.uid),
          orderBy('createdAt', 'desc')
        );
        break;
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksData: Task[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        tasksData.push({
          id: doc.id,
          title: data.title || 'Untitled Task',
          description: data.description || '',
          status: data.status || 'Pending',
          type: data.type || 'Task',
          location: data.location || '',
          createdBy: data.createdBy || '',
          createdAt: data.createdAt,
          completed: data.completed || false,
          priority: data.priority || 'Medium'
        });
      });
      
      setTasks(tasksData);
      calculateStats(tasksData);
      setUpcomingTasks(getUpcomingTasks(tasksData));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userProfile, user?.uid]);

  const calculateStats = (tasksData: Task[]) => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const newStats: DashboardStats = {
      totalTasks: tasksData.length,
      pendingTasks: tasksData.filter(task => task.status === 'Pending').length,
      inProgressTasks: tasksData.filter(task => task.status === 'In Progress').length,
      completedTasks: tasksData.filter(task => task.completed).length,
      overdueCount: tasksData.filter(task => {
        if (task.status === 'Completed') return false;
        const taskDate = task.createdAt?.toDate?.() || new Date(task.createdAt);
        return taskDate < sevenDaysAgo; // Tasks older than 7 days
      }).length,
      myTasks: tasksData.filter(task => task.createdBy === user?.uid).length,
      criticalIssues: tasksData.filter(task => 
        task.priority === 'Critical' && !task.completed
      ).length
    };

    setStats(newStats);
  };

  const getUpcomingTasks = (tasksData: Task[]): Task[] => {
    // Get pending and in-progress tasks, sorted by creation date
    return tasksData
      .filter(task => !task.completed && ['Pending', 'In Progress'].includes(task.status))
      .slice(0, 5); // Show top 5
  };

  const formatTaskForMaintenance = (task: Task) => {
    const taskDate = task.createdAt?.toDate?.() || new Date(task.createdAt);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - taskDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let dueDate: string;
    let status: 'Upcoming' | 'Scheduled' | 'Overdue';

    if (task.status === 'Completed') {
      dueDate = 'Completed';
      status = 'Scheduled';
    } else if (daysDiff > 7) {
      dueDate = `Overdue by ${daysDiff - 7} days`;
      status = 'Overdue';
    } else if (task.status === 'In Progress') {
      dueDate = 'In Progress';
      status = 'Scheduled';
    } else {
      dueDate = `Created ${daysDiff} days ago`;
      status = 'Upcoming';
    }

    return { dueDate, status };
  };

  const getStatsForRole = () => {
    if (!userProfile) return [];

    switch (userProfile.role) {
      case 'admin':
        return [
          { title: 'Total Tasks', value: stats.totalTasks.toString() },
          { title: 'Pending', value: stats.pendingTasks.toString() },
          { title: 'In Progress', value: stats.inProgressTasks.toString() },
          { title: 'Completed', value: stats.completedTasks.toString() },
        ];
      case 'technical':
        return [
          { title: 'Assigned Tasks', value: stats.totalTasks.toString() },
          { title: 'Pending Work', value: stats.pendingTasks.toString() },
          { title: 'Active Tasks', value: stats.inProgressTasks.toString() },
          { title: 'Critical Issues', value: stats.criticalIssues.toString() },
        ];
      case 'student':
      default:
        return [
          { title: 'My Complaints', value: stats.myTasks.toString() },
          { title: 'Pending', value: stats.pendingTasks.toString() },
          { title: 'In Progress', value: stats.inProgressTasks.toString() },
          { title: 'Resolved', value: stats.completedTasks.toString() },
        ];
    }
  };

  const getDashboardTitle = () => {
    if (!userProfile) return 'Dashboard';
    
    switch (userProfile.role) {
      case 'admin':
        return 'Admin Dashboard';
      case 'technical':
        return 'Technical Dashboard';
      case 'student':
      default:
        return 'My Dashboard';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Enhanced Header with Role Display */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>{getDashboardTitle()}</Text>
            <Text style={styles.headerSubtitle}>
              Welcome back, {userProfile?.displayName}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>
                {userProfile?.role.toUpperCase()}
              </Text>
            </View>
            <TouchableOpacity style={styles.settingsButton}>
              <FontAwesome name="cog" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Role-based Summary Cards */}
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.summaryGrid}>
          {getStatsForRole().map((stat, index) => (
            <SummaryCard 
              key={index}
              title={stat.title} 
              value={stat.value} 
            />
          ))}
        </View>

        {/* Quick Actions for different roles */}
        {userProfile?.role === 'admin' && (
          <View style={styles.quickActionsSection}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialIcons name="people" size={24} color="white" />
                <Text style={styles.actionText}>Manage Users</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialIcons name="analytics" size={24} color="white" />
                <Text style={styles.actionText}>View Reports</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Recent Tasks / Maintenance Items */}
        <Text style={styles.sectionTitle}>
          {userProfile?.role === 'student' ? 'My Recent Complaints' : 'Recent Tasks'}
        </Text>
        <View style={styles.maintenanceList}>
          {upcomingTasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {userProfile?.role === 'student' 
                  ? 'No complaints submitted yet' 
                  : 'No recent tasks'
                }
              </Text>
            </View>
          ) : (
            upcomingTasks.map(task => {
              const { dueDate, status } = formatTaskForMaintenance(task);
              return (
                <MaintenanceItem
                  key={task.id}
                  title={task.title}
                  dueDate={dueDate}
                  status={status}
                />
              );
            })
          )}
        </View>

        {/* Performance Metrics for Admin/Technical */}
        {(userProfile?.role === 'admin' || userProfile?.role === 'technical') && (
          <View style={styles.metricsSection}>
            <Text style={styles.sectionTitle}>Performance Metrics</Text>
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>
                  {stats.totalTasks > 0 
                    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
                    : 0}%
                </Text>
                <Text style={styles.metricLabel}>Completion Rate</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>{stats.overdueCount}</Text>
                <Text style={styles.metricLabel}>Overdue Tasks</Text>
              </View>
            </View>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  roleBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    marginTop: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionsSection: {
    marginTop: 8,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#1E293B',
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  maintenanceList: {
    marginBottom: 24,
  },
  emptyState: {
    backgroundColor: '#1E293B',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 16,
    textAlign: 'center',
  },
  metricsSection: {
    marginTop: 8,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    backgroundColor: '#1E293B',
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  metricValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  metricLabel: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
  },
});
