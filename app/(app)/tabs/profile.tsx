import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../../../context/AuthContext'; // Adjust path if needed
import { MaterialIcons } from '@expo/vector-icons';
import MyTasksList from '../../../components/MyTasksList'; // IMPORT THE NEW COMPONENT

const ProfileScreen = () => {
  const { userProfile, logout, loading } = useAuth(); // Now get 'loading' from useAuth

  if (loading) {
    return <ActivityIndicator size="large" color="#fff" style={{ flex: 1, backgroundColor: '#1C2536' }} />;
  }

  if (!userProfile) {
    return (
      <View style={styles.container}>
        <Text style={styles.userName}>Could not load profile.</Text>
        <TouchableOpacity style={styles.editProfileButton} onPress={logout}>
           <Text style={styles.editProfileButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?u=' + userProfile.uid }} // Placeholder image using uid
          style={styles.avatar}
        />
        <Text style={styles.userName}>{userProfile.displayName}</Text>
        <Text style={styles.userRole}>{userProfile.role}</Text>
        <TouchableOpacity style={styles.editProfileButton}>
          <MaterialIcons name="edit" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.editProfileButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Submitted Tasks Section - NOW USES THE COMPONENT */}
      <View style={styles.tasksSection}>
        <Text style={styles.sectionTitle}>Submitted Tasks</Text>
        <MyTasksList />
      </View>
    </View>
  );
};

// The styles for the profile screen itself remain here
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C2536',
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  userRole: {
    fontSize: 16,
    color: '#A9B4C2',
    marginBottom: 20,
    textTransform: 'capitalize',
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  editProfileButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  tasksSection: {
    flex: 1, // Ensures the list takes up the remaining space
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
});

export default ProfileScreen;



// With these changes, your code is now much cleaner, and the "My Tasks" list is a self-contained component that you could potentially reuse elsewhere if needed.'''