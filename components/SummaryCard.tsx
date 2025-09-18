import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type SummaryCardProps = {
  title: string;
  value: string;
};

export default function SummaryCard({ title, value }: SummaryCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#007AFF',
    width: '48%',
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
});