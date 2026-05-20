const https = require('https');

const TARGET_URL = 'https://tkflow-location.replit.app';
const INTERVAL_MS = 4 * 60 * 1000; // 4 minutes

setInterval(() => {
  https.get(TARGET_URL, (res) => {
    console.log(`[keepalive] ping ${TARGET_URL} → ${res.statusCode}`);
  }).on('error', (err) => {
    console.warn(`[keepalive] ping failed: ${err.message}`);
  });
}, INTERVAL_MS);

console.log(`[keepalive] pinging ${TARGET_URL} every 4 minutes`);
