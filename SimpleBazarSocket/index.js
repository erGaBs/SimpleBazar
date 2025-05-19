const io = require('socket.io-client');
const sqlite3 = require('sqlite3').verbose();

const socket = io('wss://noshydra.com', {
  transports: ['websocket']
});

const db = require('./db');


// Funzione per inviare la richiesta di ricerca delle piene
function searchPiene() {
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
    searchPiene();
  }, 10000); // 1 ora
}

//dateformatter
function toLocalISOString(date) {
  const pad = (n) => n.toString().padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

// Gestione dei risultati della ricerca
socket.on('results', (data) => {
  if (data && Array.isArray(data.results)) {
    const insertStmt = db.prepare(`
      INSERT OR REPLACE INTO items (
        ID, iconID, PricePerUnit, timestamp, Name
      ) VALUES (?, ?, ?, ?, ?)
    `);

    // Inserisci solo i primi 5 risultati
    let date = new Date();
    let dateFormatted = toLocalISOString(date);

    data.results.slice(0, 2).forEach(item => {
      insertStmt.run([
        item.SaleID,
        item.vnum,
        item.PricePerUnit,
        dateFormatted,
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
