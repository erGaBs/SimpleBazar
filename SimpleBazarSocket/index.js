const express = require('express');
const axios = require('axios');
const { Webhook, MessageBuilder } = require('discord-webhook-node');
const io = require('socket.io-client');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;
const cron = require('node-cron');

const cors = require('cors');

// Abilita CORS solo per il tuo dominio
app.use(cors({
  origin: 'https://ergabs.github.io'
}));

const socket = io('wss://noshydra.com', {
  transports: ['websocket']
});

const db = require('./db');





// La tua funzione
function cleanDB() {

   const allowedNames = [`Cristallo di Luna piena`, `Piuma d'angelo`, `Profumo`, `Benedizione di Ancelloan`, `Perla Arcobaleno`, `Fiore di ghiaccio`, `Ticket per abilità del compagno (tutte)`, `Supporto per Carta speciale dorato`, `Gemma del drago`, `Pergamena protettiva SP (alto)`]; // tua lista di nomi da conservare

  // Query per eliminare record più vecchi di 14 giorni
  const queryOldRecords = `
    DELETE FROM items
    WHERE datetime(timestamp) < datetime('now', '-14 days')
  `;

  // Query per eliminare record con Name non nella lista
  const placeholders = allowedNames.map(() => '?').join(',');
  const queryNameFilter = `
    DELETE FROM items
    WHERE Name NOT IN (${placeholders})
  `;

  db.serialize(() => {
    // Prima eliminazione: record vecchi
    db.run(queryOldRecords, function(err) {
      if (err) {
        console.error("Errore durante la pulizia dei record vecchi:", err.message);
      } else {
        console.log(`Eliminati ${this.changes} record più vecchi di 14 giorni.`);
      }
    });

    // Seconda eliminazione: nomi non presenti nella whitelist
    db.run(queryNameFilter, allowedNames, function(err) {
      if (err) {
        console.error("Errore durante la pulizia dei nomi:", err.message);
      } else {
        console.log(`Eliminati ${this.changes} record con Name non nella lista consentita.`);
      }
    });
  });
}

// Scheduler: ogni giorno alle 8:00 AM
cron.schedule('0 8 * * *', () => {
  cleanDB();
}, {
  timezone: "Europe/Rome"  // imposta il fuso orario corretto
});


// Funzione per inviare la richiesta di ricerca delle piene
async function searchPiene() {
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

async function searchPiume() {
  socket.emit('search', {
    lang: 'it',
    server: 'dragonveil',
    inputField: `Piuma d'angelo`,
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

async function searchProfumi() {
  socket.emit('search', {
    lang: 'it',
    server: 'dragonveil',
    inputField: `Profumo`,
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

async function searchAncelle() {
  socket.emit('search', {
    lang: 'it',
    server: 'dragonveil',
    inputField: `Benedizione di Ancelloan`,
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

async function searchPerle() {
  socket.emit('search', {
    lang: 'it',
    server: 'dragonveil',
    inputField: `Perla Arcobaleno`,
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

async function searchFiori() {
  socket.emit('search', {
    lang: 'it',
    server: 'dragonveil',
    inputField: `Fiore di ghiaccio`,
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

async function searchTicket() {
  socket.emit('search', {
    lang: 'it',
    server: 'dragonveil',
    inputField: `Ticket per abilità del compagno (tutte)`,
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

async function searchCarrelli() {
  socket.emit('search', {
    lang: 'it',
    server: 'dragonveil',
    inputField: `Supporto per Carta speciale dorato`,
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

async function searchGemme() {
  socket.emit('search', {
    lang: 'it',
    server: 'dragonveil',
    inputField: `Gemma del drago`,
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

async function searchUpSp2() {
  socket.emit('search', {
    lang: 'it',
    server: 'dragonveil',
    inputField: `Pergamena protettiva SP (alto)`,
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
  // scheduleNextRequest();
});

// Funzione per pianificare la prossima richiesta
// function scheduleNextRequest() {
//   setTimeout(() => {
//     searchPiume();
//     searchPiene();
//     searchProfumi();
//     searchAncelle();
//     searchPerle();
//     searchFiori();
//     searchTicket();
//     searchCarrelli();
//   }, 60000); // 1 ora
// }

const richieste = [
  searchPiene,
  searchPiume,
  searchProfumi,
  searchAncelle,
  searchPerle,
  searchFiori,
  searchTicket,
  searchCarrelli,
  searchGemme,
  searchUpSp2
];

function eseguiBatchRichieste() {
  richieste.forEach((funzioneRichiesta, i) => {
    setTimeout(async () => {
      try {
        // console.log(`▶️ Eseguo richiesta ${i + 1} alle ${new Date().toLocaleTimeString('it-IT')}`);
        await funzioneRichiesta();
      } catch (err) {
        // console.error(`❌ Errore richiesta ${i + 1}:`, err.message);
      }
    }, i * 60 * 1000); // i minuti di attesa tra una richiesta e l'altra
  });
}

// Ogni 10 minuti, parte un nuovo batch di 7 richieste
cron.schedule('*/10 * * * *', () => {
  // console.log(`\n🚀 Inizio nuovo batch alle ${new Date().toLocaleTimeString('it-IT')}`);
  eseguiBatchRichieste();
}, {
  timezone: 'Europe/Rome'
});

//dateformatter
function toLocalISOString(date) {
  const pad = (n) => n.toString().padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

// Gestione dei risultati della ricerca
socket.on('results', (data) => {
  if (data && Array.isArray(data.results)) {
    const insertStmt = db.prepare(`
      INSERT OR IGNORE INTO items (
        ID, iconID, PricePerUnit, timestamp, Name
      ) VALUES (?, ?, ?, ?, ?)
    `);

    // Inserisci solo i primi 5 risultati
    let date = new Date();
    let dateFormatted = toLocalISOString(date);

    data.results.slice(0, 2).forEach(item => {
      insertStmt.run([
        item.SaleID,
        item.IconID,
        item.PricePerUnit,
        dateFormatted,
        item.Name
      ]);
    });

    insertStmt.finalize();
    // console.log(`✅ Inseriti ${Math.min(data.results.length, 5)} record nel database.`);
  } else {
    console.warn('⚠️ Dati ricevuti non validi:', data);
  }

  // Pianifica la prossima richiesta solo dopo aver elaborato i dati correnti
  // scheduleNextRequest();
});


app.get('/item/:id', (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM items WHERE iconID = ?';

  db.all(query, [id], (err, row) => {
    if (err) {
      console.error('Errore nella query:', err.message);
      res.status(500).json({ error: 'Errore interno del server' });
    } else if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: 'Item non trovato' });
    }
  });
});

app.get('/latest-items', (req, res) => {
  const query = `
    WITH ranked_items AS (
      SELECT *,
             ROW_NUMBER() OVER (PARTITION BY iconID ORDER BY timestamp DESC) AS rn
      FROM items
    )
    SELECT ID, iconID, PricePerUnit, timestamp, Name
    FROM ranked_items
    WHERE rn = 1;
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Errore nella query:', err);
      return res.status(500).json({ error: 'Errore nel recupero dei dati' });
    }
    res.json(rows);
  });
});

app.listen(port, () => {
  console.log(`Server in ascolto su http://localhost:${port}`);
});

