const express = require('express');
const cron = require('node-cron');
const axios = require('axios'); // Assicurati di installare axios con 'npm install axios'

const app = express();
const port = 3000;


/////////////////////////////////////// SCHEDULO LE CHIAMATE ALLE LORO API (ANCORA DA COSTRUIRE I PAYLOAD E SETTARE I VARI ENDPOINT)

// Pianifica la chiamata API ogni giorno alle 8:00
cron.schedule('0 8 * * *', () => {
  console.log('Eseguo la chiamata API alle 14:00');
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
    console.log('Eseguo la chiamata API alle 14:00');
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