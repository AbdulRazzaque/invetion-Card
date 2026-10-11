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

  async function takeScreenshot(filepath) {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(filepath, Buffer.from(res.data, 'base64'));
    console.log('Saved screenshot:', filepath);
  }

  // Scroll to card 2
  await evaluate('document.getElementById("invitation-card-2-container")?.scrollIntoView({ behavior: "instant" })');
  await new Promise(r => setTimeout(r, 400));
  await takeScreenshot('e:/Private work/invetion Card/view_card_2.png');

  // Scroll to card 3
  await evaluate('document.getElementById("invitation-card-3-container")?.scrollIntoView({ behavior: "instant" })');
  await new Promise(r => setTimeout(r, 400));
  await takeScreenshot('e:/Private work/invetion Card/view_card_3.png');

  ws.close();
}

run().catch(console.error);
