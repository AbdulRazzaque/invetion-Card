const http = require('http');
const fs = require('fs');
const WebSocket = require('ws');

function getPageWs() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:9222/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const tabs = JSON.parse(data);
        const page = tabs.find(t => t.type === 'page' && t.url.includes('5175'));
        if (!page) return reject(new Error('Page not found'));
        resolve(page.webSocketDebuggerUrl);
      });
    }).on('error', reject);
  });
}

async function run() {
  const wsUrl = await getPageWs();
  const ws = new WebSocket(wsUrl);

  let id = 1;
  const pending = new Map();
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      pending.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  ws.on('message', (raw) => {
    const data = JSON.parse(raw);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
    }
  });

  await new Promise(r => ws.on('open', r));

  async function evaluate(expression) {
    const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    return res.result ? res.result.value : null;
  }

  // Export card 1, 2, 3 blobs as base64
  for (const cardId of [1, 2, 3]) {
    const base64Data = await evaluate(`
      (async () => {
        const module = await import('/src/utils/individualCardExport.ts');
        const blob = await module.generateIndividualCardBlob(${cardId}, {
          guestName: 'Abdul Razzaque',
          guestTitle: 'None'
        });
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      })()
    `);

    if (base64Data) {
      const buffer = Buffer.from(base64Data.split(',')[1], 'base64');
      fs.writeFileSync(`e:/Private work/invetion Card/exported_blob_card_${cardId}.png`, buffer);
      console.log(`Saved exported_blob_card_${cardId}.png`);
    } else {
      console.log(`Failed to export card ${cardId}`);
    }
  }

  ws.close();
}

run().catch(console.error);
