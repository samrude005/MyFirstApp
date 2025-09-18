import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Status = 'Upcoming' | 'Scheduled' | 'Overdue';

type MaintenanceItemProps = {
  title: string;
  dueDate: string;
  status: Status;
};

const statusColors = {
  Upcoming: { bg: '#FBBF24', text: '#78350F' }, // Amber
  Scheduled: { bg: '#34D399', text: '#065F46' }, // Emerald
  Overdue: { bg: '#F87171', text: '#991B1B' }, // Red
};


export default function MaintenanceItem({ title, dueDate, status }: MaintenanceItemProps) {
  const { bg, text } = statusColors[status];

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="calendar-clock" size={24} color="#A5B4FC" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.dueDate}>{dueDate}</Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: bg }]}>
        <Text style={[styles.statusText, { color: text }]}>{status}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#334155', // Slate-700
    },
    iconContainer: {
        backgroundColor: '#334155',
        padding: 12,
        borderRadius: 999, // Circle
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
        marginRight: 8,
    },
    title: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    dueDate: {
        color: '#94A3B8', // Slate-400
        fontSize: 14,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 999,
    },
    statusText: {
        fontWeight: 'bold',
        fontSize: 12,
    },
});