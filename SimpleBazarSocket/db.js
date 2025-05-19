const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./simpleNB.db');

// Creazione della tabella se non esiste
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS items (
      ID INTEGER PRIMARY KEY,
      iconID TEXT,
      timestamp TEXT,
      PricePerUnit INTEGER,
      Name TEXT
    )
  `);
});

module.exports = db;
