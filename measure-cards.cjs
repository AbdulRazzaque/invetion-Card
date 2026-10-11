const fs = require('fs');

// We have the browser running, we can load each image into a canvas in the browser and inspect pixel coordinates!
const http = require('http');
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

  // Measure card-1 dots and colon
  // In card-1 (1024 x 558), let's crop the region around y: 150-210, x: 250-750 and save as an image
  const card1Crop = await evaluate(`
    (async () => {
      const img = new Image();
      img.src = '/invitations/card-1.jpg';
      await new Promise(r => img.onload = r);
      const canvas = document.createElement('canvas');
      canvas.width = 500;
      canvas.height = 80;
      const ctx = canvas.getContext('2d');
      // Crop x: 300 to 800, y: 140 to 220
      ctx.drawImage(img, 300, 140, 500, 80, 0, 0, 500, 80);
      return canvas.toDataURL('image/png');
    })()
  `);
  if (card1Crop) {
    fs.writeFileSync('e:/Private work/invetion Card/crop_card_1_guest_area.png', Buffer.from(card1Crop.split(',')[1], 'base64'));
    console.log('Saved crop_card_1_guest_area.png');
  }

  // Measure card-3 line
  // In card-3 (1024 x 558), let's crop x: 200 to 600, y: 140 to 220
  const card3Crop = await evaluate(`
    (async () => {
      const img = new Image();
      img.src = '/invitations/card-3.jpg';
      await new Promise(r => img.onload = r);
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 80;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 240, 140, 400, 80, 0, 0, 400, 80);
      return canvas.toDataURL('image/png');
    })()
  `);
  if (card3Crop) {
    fs.writeFileSync('e:/Private work/invetion Card/crop_card_3_guest_area.png', Buffer.from(card3Crop.split(',')[1], 'base64'));
    console.log('Saved crop_card_3_guest_area.png');
  }

  // Measure card-2 whitespace
  // In card-2 (920 x 1220), let's crop x: 200 to 720, y: 350 to 550
  const card2Crop = await evaluate(`
    (async () => {
      const img = new Image();
      img.src = '/invitations/card-2.jpg';
      await new Promise(r => img.onload = r);
      const canvas = document.createElement('canvas');
      canvas.width = 520;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 200, 350, 520, 200, 0, 0, 520, 200);
      return canvas.toDataURL('image/png');
    })()
  `);
  if (card2Crop) {
    fs.writeFileSync('e:/Private work/invetion Card/crop_card_2_guest_area.png', Buffer.from(card2Crop.split(',')[1], 'base64'));
    console.log('Saved crop_card_2_guest_area.png');
  }

  ws.close();
}

run().catch(console.error);
