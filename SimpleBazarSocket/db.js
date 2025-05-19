const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./simpleNB.db');

// Creazione della tabella se non esiste
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS sales (
      SaleID INTEGER PRIMARY KEY,
      vnum TEXT,
      Amount INTEGER,
      PricePerUnit INTEGER,
      TimePeriod INTEGER,
      TimePeriodType TEXT,
      SellerName TEXT,
      Name TEXT
    )
  `);
});

module.exports = db;
