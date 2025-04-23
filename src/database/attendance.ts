import SQLite from 'react-native-sqlite-storage';

export interface Student {
  id: number;
  name: string;
  studentNumber: string;
  class: string;
}

export interface Attendance {
  id: number;
  studentId: number;
  date: string;
  status: 'present' | 'absent';
}

export interface Report {
  id: string;
  title: string;
  date: string;
  totalStudents: number;
  absentStudents: number;
}

const db = SQLite.openDatabase(
  {
    name: 'YoklamaDB',
    location: 'default',
  },
  () => {},
  error => {
    console.error('Veritabanı açılırken hata oluştu:', error);
  }
);

export const initDatabase = () => {
  db.transaction(tx => {
    // Öğrenciler tablosu
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS students (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, studentNumber TEXT, class TEXT)'
    );
    
    // Devamsızlık tablosu
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS attendance (id INTEGER PRIMARY KEY AUTOINCREMENT, studentId INTEGER, date TEXT, status TEXT, FOREIGN KEY(studentId) REFERENCES students(id))'
    );
  });
};

export const getAttendanceReports = async (): Promise<Report[]> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT 
          date,
          COUNT(*) as totalStudents,
          SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absentStudents
         FROM attendance
         GROUP BY date
         ORDER BY date DESC`,
        [],
        (_, results) => {
          const reports: Report[] = [];
          for (let i = 0; i < results.rows.length; i++) {
            const row = results.rows.item(i);
            reports.push({
              id: i.toString(),
              title: `${row.date} Devamsızlık Raporu`,
              date: row.date,
              totalStudents: row.totalStudents,
              absentStudents: row.absentStudents
            });
          }
          resolve(reports);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

export const addStudent = (name: string, studentNumber: string, class_: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO students (name, studentNumber, class) VALUES (?, ?, ?)',
        [name, studentNumber, class_],
        (_, result) => resolve(result.insertId),
        (_, error) => reject(error)
      );
    });
  });
};

export const markAttendance = (studentId: number, date: string, status: 'present' | 'absent'): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO attendance (studentId, date, status) VALUES (?, ?, ?)',
        [studentId, date, status],
        (_, result) => resolve(result.insertId),
        (_, error) => reject(error)
      );
    });
  });
};

export const getStudents = async (): Promise<Student[]> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM students',
        [],
        (_, results) => {
          const students: Student[] = [];
          for (let i = 0; i < results.rows.length; i++) {
            students.push(results.rows.item(i));
          }
          resolve(students);
        },
        (_, error) => reject(error)
      );
    });
  });
}; 