import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { getStudents, markAttendance, Student } from '../database/attendance';

const Attendance = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const studentsData = await getStudents();
      setStudents(studentsData);
    } catch (error) {
      console.error('Öğrenciler yüklenirken hata oluştu:', error);
    }
  };

  const handleMarkAttendance = async (studentId: number, status: 'present' | 'absent') => {
    try {
      await markAttendance(studentId, selectedDate, status);
      Alert.alert('Başarılı', 'Devamsızlık durumu kaydedildi');
    } catch (error) {
      Alert.alert('Hata', 'Devamsızlık durumu kaydedilirken bir hata oluştu');
    }
  };

  const renderStudentItem = ({ item }: { item: Student }) => (
    <View style={styles.studentItem}>
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{item.name}</Text>
        <Text style={styles.studentDetails}>
          {item.studentNumber} - {item.class}
        </Text>
      </View>
      <View style={styles.attendanceButtons}>
        <TouchableOpacity
          style={[styles.attendanceButton, styles.presentButton]}
          onPress={() => handleMarkAttendance(item.id, 'present')}
        >
          <Text style={styles.buttonText}>Var</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.attendanceButton, styles.absentButton]}
          onPress={() => handleMarkAttendance(item.id, 'absent')}
        >
          <Text style={styles.buttonText}>Yok</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Devamsızlık Takibi</Text>
      <Text style={styles.dateText}>Tarih: {selectedDate}</Text>
      
      <FlatList
        data={students}
        renderItem={renderStudentItem}
        keyExtractor={(item) => item.id.toString()}
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
    marginBottom: 8,
    color: '#333',
  },
  dateText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  studentItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  studentDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  attendanceButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  attendanceButton: {
    padding: 8,
    borderRadius: 4,
    minWidth: 60,
    alignItems: 'center',
  },
  presentButton: {
    backgroundColor: '#4CAF50',
  },
  absentButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Attendance; 