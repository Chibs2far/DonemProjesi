import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { getAttendanceReports, Report } from '../database/attendance';

const Reports = () => {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const reportsData = await getAttendanceReports();
      setReports(reportsData);
    } catch (error) {
      console.error('Raporlar yüklenirken hata oluştu:', error);
    }
  };

  const renderReportItem = ({ item }: { item: Report }) => (
    <TouchableOpacity style={styles.reportItem}>
      <Text style={styles.reportTitle}>{item.title}</Text>
      <Text style={styles.reportDate}>{item.date}</Text>
      <Text style={styles.reportSummary}>
        Toplam Öğrenci: {item.totalStudents} | Devamsız: {item.absentStudents}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Devamsızlık Raporları</Text>
      <FlatList
        data={reports}
        renderItem={renderReportItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  list: {
    flex: 1,
  },
  reportItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  reportDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  reportSummary: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
});

export default Reports;
