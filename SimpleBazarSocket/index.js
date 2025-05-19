const io = require('socket.io-client');
const sqlite3 = require('sqlite3').verbose();

const socket = io('wss://noshydra.com', {
  transports: ['websocket']
});

const db = new sqlite3.Database('noshydras.db');

// Creazione della tabella se non esiste
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

// Funzione per inviare la richiesta di ricerca
function sendSearchRequest() {
  socket.emit('search', {
    lang: 'it',
    server: 'dragonveil',
    inputField: 'Cristallo di Luna piena',
    categoryDropdownIndex: 0,
    subCategoryDropdownIndex: -1,
    levelDropdownIndex: -1,
    rarityLevelDropdownIndex: -1,
    upgradeLevelDropdownIndex: -1,
    sortByDropdownIndex: 0,
    page: 1,
    shellFilters: []
  });
}

// Gestione della connessione
socket.on('connect', () => {
  console.log('✅ Connesso al WebSocket');
  // Avvia il ciclo di richieste
  scheduleNextRequest();
});

// Funzione per pianificare la prossima richiesta
function scheduleNextRequest() {
  setTimeout(() => {
    sendSearchRequest();
  }, 10000); // 10 secondi
}

// Gestione dei risultati della ricerca
socket.on('results', (data) => {
  if (data && Array.isArray(data.results)) {
    const insertStmt = db.prepare(`
      INSERT OR REPLACE INTO sales (
        SaleID, vnum, Amount, PricePerUnit, TimePeriod, TimePeriodType, SellerName, Name
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Inserisci solo i primi 5 risultati
    data.results.slice(0, 5).forEach(item => {
      insertStmt.run([
        item.SaleID,
        item.vnum,
        item.Amount,
        item.PricePerUnit,
        item.TimePeriod,
        item.TimePeriodType,
        item.SellerName,
        item.Name
      ]);
    });

    insertStmt.finalize();
    console.log(`✅ Inseriti ${Math.min(data.results.length, 5)} record nel database.`);
  } else {
    console.warn('⚠️ Dati ricevuti non validi:', data);
  }

  // Pianifica la prossima richiesta solo dopo aver elaborato i dati correnti
  scheduleNextRequest();
});
