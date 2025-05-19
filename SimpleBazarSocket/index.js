const express = require('express');
const axios = require('axios');
const { Webhook, MessageBuilder } = require('discord-webhook-node');
const io = require('socket.io-client');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

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

function searchPiume() {
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

function searchProfumi() {
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

// Gestione della connessione
socket.on('connect', () => {
  console.log('✅ Connesso al WebSocket');
  // Avvia il ciclo di richieste
  scheduleNextRequest();
});

// Funzione per pianificare la prossima richiesta
function scheduleNextRequest() {
  setTimeout(() => {
    searchPiume();
    searchPiene();
    searchProfumi();
  }, 3600000); // 1 ora
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

/////////////////////////////////////////           DISCORD             /////////////////////////////////////////////

let lastMessageId = null; // Variabile per memorizzare l'ID dell'ultimo messaggio inviato
const ora = new Date().toLocaleString('it-IT');

function toLocalISOString(date) {
  const pad = (n) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

async function getLatestItemsAndSend() {
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

  db.all(query, [], async (err, rows) => {
    if (err) {
      console.error('Errore nella query:', err);
      return;
    }

    if (rows.length === 0) {
      console.log('Nessun dato trovato.');
      return;
    }

    const now = new Date();
    const timestamp = toLocalISOString(now);
    const messages = rows.map(item =>
      `🧾 **${item.Name}** (iconID: ${item.iconID})\n💰 Prezzo: ${item.PricePerUnit} 🕒 ${item.timestamp}\n`
    );

    const messageChunks = [];
    let currentChunk = '';
    for (const msg of messages) {
      if ((currentChunk + '\n' + msg).length > 1900) {
        messageChunks.push(currentChunk);
        currentChunk = msg;
      } else {
        currentChunk += '\n' + msg;
      }
    }
    if (currentChunk) messageChunks.push(currentChunk);

    const webhookUrl = 'https://discord.com/api/webhooks/1374087262639362058/xUWfIIWUsyqf8D_pCAzo8ksUmCKXMRU_nstatAihGKEgPyOitLEORqJpmMUi0WOujS6v';

    try {
      // Cancella il messaggio precedente se esiste
      if (lastMessageId) {
        await axios.delete(`${webhookUrl}/messages/${lastMessageId}`);
        console.log('✅ Messaggio precedente cancellato.');
      }

      // Invia il nuovo messaggio e salva il suo ID
      const response = await axios.post(`${webhookUrl}?wait=true`, {
        content: `📦 **Aggiornamento Prezzi - ${ora}**\n\n${messageChunks.join('\n')}`
      });

      lastMessageId = response.data.id;
      console.log(`✅ Inviati ${rows.length} record su Discord.`);
    } catch (error) {
      console.error('Errore durante l\'invio o la cancellazione del messaggio su Discord:', error);
    }
  });
}

let previousMessageId = null;

  setInterval(() => {
    getLatestItemsAndSend();
    analyzeAndSendActions();
  }, 10000); // 1 ora


//ALGORITMI DI CALCOLO DEL PREZZO

const DISCORD_WEBHOOK_URL2 = 'https://discord.com/api/webhooks/1374101631762698440/q6O7rF2STZTIxaC76nz2S_KY-QafllvuiPksLBSgwkjHMgc9S0lm3CwLCsKV8XVrxz-J';
const MARGINE_DESIDERATO2 = 0.05; // 5%

function toLocalISOString(date) {
  const pad = (n) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function getAction(prices, currentPrice) {
  if (prices.length < 2) return 'DATI INSUFFICIENTI';

  const recentPrices = prices.map(p => Number(p.PricePerUnit));
  const avg = recentPrices.reduce((sum, p) => sum + p, 0) / recentPrices.length;

  const maxPrice = Math.max(...recentPrices);
  const minPrice = Math.min(...recentPrices);

  const thresholdBuy = avg * (1 - MARGINE_DESIDERATO2);
  const thresholdSell = avg * (1 + MARGINE_DESIDERATO2);

  if (currentPrice <= thresholdBuy) {
    const bestSellPrice = maxPrice;
    const bestSellObj = prices.find(p => Number(p.PricePerUnit) === bestSellPrice);
    const bestSellTime = bestSellObj ? bestSellObj.timestamp : 'momento sconosciuto';

    return `ACQUISTA ora. Rivendi quando il prezzo arriva a ${bestSellPrice} (es. ${bestSellTime})`;
  }

  if (currentPrice >= thresholdSell) {
    return `VENDI ORA. Prezzo superiore alla media (${avg.toFixed(2)})`;
  }

  return 'ASPETTA. Prezzo nella media, nessuna opportunità chiara.';
}

function analyzeAndSendActions() {
  const query = `
    SELECT iconID, Name, PricePerUnit, timestamp
    FROM items
    ORDER BY iconID, timestamp DESC
  `;

  db.all(query, [], async (err, rows) => {
    if (err) {
      console.error('Errore nella query:', err);
      return;
    }

    if (rows.length === 0) {
      console.log('Nessun dato trovato.');
      return;
    }

    // Raggruppa i dati per iconID
    const groupedData = {};
    rows.forEach(row => {
      if (!groupedData[row.iconID]) {
        groupedData[row.iconID] = [];
      }
      groupedData[row.iconID].push(row);
    });

    const ora = new Date().toLocaleString('it-IT');
    let messaggio = `📊 **Analisi Azioni Consigliate - ${ora}**\n\n`;

    for (const iconID in groupedData) {
      const items = groupedData[iconID];
      const currentItem = items[0]; // Ultimo prezzo
      const action = getAction(items, currentItem.PricePerUnit);

      messaggio += `🧾 **${currentItem.Name}** (iconID: ${iconID})\n`;
      messaggio += `💰 Prezzo Attuale: €${currentItem.PricePerUnit}\n`;
      messaggio += `🔍 Azione: ${action}\n\n`;
    }

    try {
      // Se esiste un messaggio precedente, cancellalo
      if (previousMessageId) {
        const deleteUrl = `${DISCORD_WEBHOOK_URL2}/messages/${previousMessageId}`;
        const deleteResponse = await fetch(deleteUrl, { method: 'DELETE' });

        if (!deleteResponse.ok) {
          console.warn(`⚠️ Impossibile cancellare il messaggio precedente (ID: ${previousMessageId}).`);
        } else {
          console.log(`✅ Messaggio precedente (ID: ${previousMessageId}) cancellato con successo.`);
        }
      }

      // Invia il nuovo messaggio e ottieni l'ID
      const response = await fetch(`${DISCORD_WEBHOOK_URL2}?wait=true`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: messaggio })
      });

      if (!response.ok) {
        console.error('Errore nell\'invio a Discord:', await response.text());
        return;
      }

      const data = await response.json();
      previousMessageId = data.id; // Memorizza l'ID del nuovo messaggio
      console.log(`✅ Messaggio inviato su Discord. ID: ${previousMessageId}`);
    } catch (error) {
      console.error('Errore nell\'invio a Discord:', error);
    }
  });
}