import * as SQLite from 'expo-sqlite';

// Open or create a new SQLite database
const db = SQLite.openDatabase('tracking.db');

// Create a table for storing offline location data
export const setupDatabase = () => {
    db.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS tracking (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                latitude REAL,
                longitude REAL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            );`,
            [],
            () => console.log('Tracking database created successfully'),
            error => console.log('Error creating tracking database', error)
        );
    });
};

export const saveLocationOffline = (userId, latitude, longitude) => {
  db.transaction(tx => {
      tx.executeSql(
          `INSERT INTO tracking (user_id, latitude, longitude) VALUES (?, ?, ?)`,
          [userId, latitude, longitude],
          (_, result) => console.log('Location saved offline', result),
          (_, error) => console.log('Error saving location offline', error)
      );
  });
};


export default db;


