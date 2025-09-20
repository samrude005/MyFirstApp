import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import SummaryCard from '../../../components/SummaryCard';
import MaintenanceItem from '../../../components/MaintenanceItem';

// We will create these components in the next steps

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* STEP 3: HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <TouchableOpacity>
            <FontAwesome name="cog" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* STEP 4: SUMMARY CARDS */}
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.summaryGrid}>
    <SummaryCard title="Total Equipment" value="150" />
    <SummaryCard title="Operational" value="120" />
    <SummaryCard title="Under Maintenance" value="20" />
    <SummaryCard title="Broken" value="10" />
</View>

        {/* We'll skip the chart for now to keep it simple */}

        {/* STEP 5: UPCOMING MAINTENANCE */}
        <View style={styles.maintenanceList}>
    <MaintenanceItem
        title="HVAC System Check"
        dueDate="Due in 7 days"
        status="Upcoming"
    />
    <MaintenanceItem
        title="Electrical Panel Inspection"
        dueDate="Due in 14 days"
        status="Scheduled"
    />
    <MaintenanceItem
        title="Generator Maintenance"
        dueDate="Overdue by 3 days"
        status="Overdue"
    />
</View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A', // Dark blue-black background
  },
  container: {
    flex: 1,
    padding: 16,
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
  // TEMPORARY STYLES for the cards - we will move this to a component
  card: {
    backgroundColor: '#007AFF',
    width: '48%', // Two cards per row
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  cardTitle: {
    color: '#E0E0E0',
    fontSize: 16,
  },
  cardValue: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  maintenanceList: {
    // This will hold our list items
  }
});