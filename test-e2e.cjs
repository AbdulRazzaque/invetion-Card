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
  console.log('Connecting to', wsUrl);
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
    const res = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    return res.result ? res.result.value : null;
  }

  async function takeScreenshot(filepath) {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(filepath, Buffer.from(res.data, 'base64'));
    console.log('Saved screenshot:', filepath);
  }

  console.log('=== TEST 1: Enter Guest Name "Mohammed" ===');
  await evaluate(`
    (() => {
      const input = document.querySelector('input[placeholder*="Abdul Rahman"]');
      if (input) {
        // Set value and trigger React synthetic event
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(input, "Mohammed");
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    })()
  `);

  await new Promise(r => setTimeout(r, 600));

  const mohammedText = await evaluate(`
    (() => {
      const card1 = document.getElementById('invitation-card-1-container')?.innerText;
      const card2 = document.getElementById('invitation-card-2-container')?.innerText;
      const card3 = document.getElementById('invitation-card-3-container')?.innerText;
      return {
        card1HasMohammed: card1?.includes('Mohammed'),
        card2HasMohammed: card2?.includes('Mohammed'),
        card3HasMohammed: card3?.includes('Mohammed')
      };
    })()
  `);
  console.log('Card preview verification for "Mohammed":', mohammedText);

  await takeScreenshot('e:/Private work/invetion Card/test-preview-mohammed.png');

  console.log('=== TEST 2: Click Copy Image under Invitation 1 ===');
  await evaluate(`
    (() => {
      const btn = document.getElementById('copy-card-1-btn');
      if (btn) btn.click();
    })()
  `);

  await new Promise(r => setTimeout(r, 300));

  const buttonStates1 = await evaluate(`
    (() => {
      return {
        btn1Text: document.getElementById('copy-card-1-btn')?.innerText.trim(),
        btn2Text: document.getElementById('copy-card-2-btn')?.innerText.trim(),
        btn3Text: document.getElementById('copy-card-3-btn')?.innerText.trim()
      };
    })()
  `);
  console.log('Button states after clicking Card 1:', buttonStates1);

  console.log('=== TEST 3: Change Guest Name to "Abdul Rahman" ===');
  await evaluate(`
    (() => {
      const input = document.querySelector('input[placeholder*="Abdul Rahman"]');
      if (input) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(input, "Abdul Rahman");
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    })()
  `);

  await new Promise(r => setTimeout(r, 600));

  const abdulRahmanText = await evaluate(`
    (() => {
      const card1 = document.getElementById('invitation-card-1-container')?.innerText;
      const card2 = document.getElementById('invitation-card-2-container')?.innerText;
      const card3 = document.getElementById('invitation-card-3-container')?.innerText;
      return {
        card1HasAbdulRahman: card1?.includes('Abdul Rahman'),
        card2HasAbdulRahman: card2?.includes('Abdul Rahman'),
        card3HasAbdulRahman: card3?.includes('Abdul Rahman')
      };
    })()
  `);
  console.log('Card preview verification for "Abdul Rahman":', abdulRahmanText);

  await takeScreenshot('e:/Private work/invetion Card/test-preview-abdulrahman.png');

  console.log('=== TEST 4: Click Copy Image under Invitation 2 ===');
  await evaluate(`
    (() => {
      const btn = document.getElementById('copy-card-2-btn');
      if (btn) btn.click();
    })()
  `);

  await new Promise(r => setTimeout(r, 300));

  const buttonStates2 = await evaluate(`
    (() => {
      return {
        btn1Text: document.getElementById('copy-card-1-btn')?.innerText.trim(),
        btn2Text: document.getElementById('copy-card-2-btn')?.innerText.trim(),
        btn3Text: document.getElementById('copy-card-3-btn')?.innerText.trim()
      };
    })()
  `);
  console.log('Button states after clicking Card 2:', buttonStates2);

  console.log('=== TEST 5: Click Copy Image under Invitation 3 ===');
  await evaluate(`
    (() => {
      const btn = document.getElementById('copy-card-3-btn');
      if (btn) btn.click();
    })()
  `);

  await new Promise(r => setTimeout(r, 300));

  const buttonStates3 = await evaluate(`
    (() => {
      return {
        btn1Text: document.getElementById('copy-card-1-btn')?.innerText.trim(),
        btn2Text: document.getElementById('copy-card-2-btn')?.innerText.trim(),
        btn3Text: document.getElementById('copy-card-3-btn')?.innerText.trim()
      };
    })()
  `);
  console.log('Button states after clicking Card 3:', buttonStates3);

  ws.close();
  console.log('=== ALL E2E TESTS COMPLETED ===');
}

run().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
