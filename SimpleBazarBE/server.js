const express = require('express');
const cron = require('node-cron');
const sqlite3 = require("sqlite3").verbose();
const axios = require('axios'); // Assicurati di installare axios con 'npm install axios'

const app = express();
const port = 3000;




const db = new sqlite3.Database("./nosbz3.0.db", (err) => {
  if (err) {
    console.error("Errore nella connessione al database:", err.message);
  } else {
    console.log("Connesso a SQLite.");
  }
});

db.run(`
  CREATE TABLE IF NOT EXISTS categorie (
    id INTEGER PRIMARY KEY,
    name TEXT,
    img TEXT
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS data (
    id INTEGER,
    prezzo INTEGER,
    timestamp TEXT,
    FOREIGN KEY (id) REFERENCES categorie(id)
  )
`);



app.get("/aggiorna-dati", async (req, res) => {
  const ids = [22399, 22424, 22422]; // Aggiungi qui tutti gli ID desiderati
  let risultatiFinali = [];

  for (const itemId of ids) {
    try {
      const response = await axios.post("https://noshydra.com/get_results_from_searches", {
        lang: "it",
        server: "dragonveil",
        id: String(itemId),
        shellFilters: []
      });

      const dataAPI = response.data;
      const firstResult = dataAPI.results[0];

      if (!firstResult) {
        risultatiFinali.push({ id: itemId, errore: "Nessun risultato trovato" });
        continue;
      }

      const vnum = parseInt(firstResult.vnum);
      const prezzo = parseInt(firstResult.PricePerUnit);
      const timestamp = Date.now();
      const name = firstResult.Name;
      const img = `https://noshydra.com/static/images/items_icons/${vnum}.png`;

      await new Promise((resolve, reject) => {
        db.get("SELECT id FROM categorie WHERE id = ?", [vnum], (err, row) => {
          if (err) return reject(err);

          const inserisciData = () => {
            db.run(
              "INSERT INTO data (id, prezzo, timestamp) VALUES (?, ?, ?)",
              [vnum, prezzo, timestamp],
              (err) => {
                if (err) return reject(err);
                risultatiFinali.push({
                  id: vnum,
                  categoria: { name, img },
                  data: { prezzo, timestamp }
                });
                resolve();
              }
            );
          };

          if (row) {
            inserisciData();
          } else {
            db.run(
              "INSERT INTO categorie (id, name, img) VALUES (?, ?, ?)",
              [vnum, name, img],
              (err) => {
                if (err) return reject(err);
                inserisciData();
              }
            );
          }
        });
      });
    } catch (error) {
      risultatiFinali.push({ id: itemId, errore: error.message });
    }
  }

  res.json({ risultato: risultatiFinali });
});



/////////////////////////////////////// SCHEDULO LE CHIAMATE ALLE LORO API (ANCORA DA COSTRUIRE I PAYLOAD E SETTARE I VARI ENDPOINT)

// Pianifica la chiamata API ogni giorno alle 8:00
cron.schedule('0 8 * * *', () => {
  console.log('Eseguo la chiamata API alle 8:00');
  axios.get('https://disease.sh/v3/covid-19/historical/all?lastdays=all')
    .then(response => {
      console.log('Risposta API:', response.data);
    })
    .catch(error => {
      console.error('Errore nella chiamata API:', error);
    });
});

// Pianifica la chiamata API ogni giorno alle 12:00
cron.schedule('0 12 * * *', () => {
    console.log('Eseguo la chiamata API alle 12:00');
    axios.get('https://disease.sh/v3/covid-19/historical/all?lastdays=all')
      .then(response => {
        console.log('Risposta API:', response.data);
      })
      .catch(error => {
        console.error('Errore nella chiamata API:', error);
      });
  });

  // Pianifica la chiamata API ogni giorno alle 16:00
cron.schedule('0 16 * * *', () => {
    console.log('Eseguo la chiamata API alle 14:00');
    axios.get('https://disease.sh/v3/covid-19/historical/all?lastdays=all')
      .then(response => {
        console.log('Risposta API:', response.data);
      })
      .catch(error => {
        console.error('Errore nella chiamata API:', error);
      });
  });

  // Pianifica la chiamata API ogni giorno alle 21:00
cron.schedule('0 21 * * *', () => {
    console.log('Eseguo la chiamata API alle 14:00');
    axios.get('https://disease.sh/v3/covid-19/historical/all?lastdays=all')
      .then(response => {
        console.log('Risposta API:', response.data);
      })
      .catch(error => {
        console.error('Errore nella chiamata API:', error);
      });
  });


/////////////////////////////////////// CHIAMATE ALLE NOSTRE API

app.get('/', (req, res) => {
  res.send('Ciao dal backend Node.js!');
});

app.listen(port, () => {
  console.log(`Server in ascolto su http://localhost:${port}`);
});