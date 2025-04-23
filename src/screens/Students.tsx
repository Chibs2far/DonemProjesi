import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { getStudents, addStudent, Student } from '../database/attendance';

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [newStudent, setNewStudent] = useState({
    name: '',
    studentNumber: '',
    class: ''
  });

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

  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.studentNumber || !newStudent.class) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    try {
      await addStudent(newStudent.name, newStudent.studentNumber, newStudent.class);
      setNewStudent({ name: '', studentNumber: '', class: '' });
      loadStudents();
      Alert.alert('Başarılı', 'Öğrenci başarıyla eklendi');
    } catch (error) {
      Alert.alert('Hata', 'Öğrenci eklenirken bir hata oluştu');
    }
  };

  const renderStudentItem = ({ item }: { item: Student }) => (
    <View style={styles.studentItem}>
      <Text style={styles.studentName}>{item.name}</Text>
      <Text style={styles.studentInfo}>Öğrenci No: {item.studentNumber}</Text>
      <Text style={styles.studentInfo}>Sınıf: {item.class}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Öğrenci Yönetimi</Text>
      
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Öğrenci Adı"
          value={newStudent.name}
          onChangeText={(text) => setNewStudent({ ...newStudent, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Öğrenci Numarası"
          value={newStudent.studentNumber}
          onChangeText={(text) => setNewStudent({ ...newStudent, studentNumber: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Sınıf"
          value={newStudent.class}
          onChangeText={(text) => setNewStudent({ ...newStudent, class: text })}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddStudent}>
          <Text style={styles.addButtonText}>Öğrenci Ekle</Text>
        </TouchableOpacity>
      </View>

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
    marginBottom: 16,
    color: '#333',
  },
  form: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  studentInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default Students; 