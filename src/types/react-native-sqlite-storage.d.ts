declare module 'react-native-sqlite-storage' {
  interface SQLiteDatabase {
    transaction: (
      callback: (transaction: SQLiteTransaction) => void,
      error?: (error: any) => void,
      success?: () => void
    ) => void;
  }

  interface SQLiteTransaction {
    executeSql: (
      sql: string,
      args?: any[],
      success?: (transaction: SQLiteTransaction, result: SQLiteResult) => void,
      error?: (transaction: SQLiteTransaction, error: any) => void
    ) => void;
  }

  interface SQLiteResult {
    rows: {
      length: number;
      item: (index: number) => any;
    };
    insertId?: number;
  }

  function openDatabase(
    params: {
      name: string;
      location?: string;
    },
    success?: () => void,
    error?: (error: any) => void
  ): SQLiteDatabase;

  export default {
    openDatabase,
  };
} 