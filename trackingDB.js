import * as SQLite from 'expo-sqlite';

// Open (or create) the SQLite database
const db = SQLite.openDatabase('trackingData.db');

// Function to initialize the database
export const initializeDatabase = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS tracking (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        latitude REAL,
        longitude REAL,
        timestamp TEXT
      );`,
      [],
      () => console.log('✅ Tracking table created successfully'),
      (_, error) => console.error('❌ Error creating table:', error)
    );
  });
};