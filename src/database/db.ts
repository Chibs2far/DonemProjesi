import SQLite from "react-native-sqlite-storage";

const db = SQLite.openDatabase(
  {
    name: "attendance.db",
    location: "default",
  },
  () => {
    console.log("Veritabanı başarıyla açıldı!");
  },
  (error) => {
    console.log("Veritabanı hatası: ", error);
  }
);

export default db;
