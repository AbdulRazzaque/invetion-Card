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
        if (!page) return reject(new Error('Page not found on 5175'));
        resolve(page.webSocketDebuggerUrl);
      });
    }).on('error', reject);
  });
}

async function run() {
  const wsUrl = await getPageWs();
  console.log('Connected to Edge CDP:', wsUrl);
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

  // Set viewport
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1200,
    deviceScaleFactor: 1,
    mobile: false
  });

  // Reload page to get fresh bundle
  await send('Page.reload');
  await new Promise(r => setTimeout(r, 1200));

  async function evaluate(expression) {
    const res = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    return res.result ? res.result.value : null;
  }

  async function captureElementScreenshot(selector, filepath) {
    await evaluate(`
      (() => {
        const el = document.querySelector('${selector}');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
      })()
    `);
    await new Promise(r => setTimeout(r, 200));

    const clip = await evaluate(`
      (() => {
        const el = document.querySelector('${selector}');
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return {
          x: Math.max(0, rect.x + window.scrollX),
          y: Math.max(0, rect.y + window.scrollY),
          width: rect.width,
          height: rect.height,
          scale: 1
        };
      })()
    `);

    if (!clip) {
      console.error('Element not found for clip:', selector);
      return;
    }

    const res = await send('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: clip.x,
        y: clip.y,
        width: clip.width,
        height: clip.height,
        scale: 1
      }
    });
    fs.writeFileSync(filepath, Buffer.from(res.data, 'base64'));
    console.log('Saved preview screenshot:', filepath);
  }

  const testNames = [
    'Mr. Abdur rzzaue',
    'Abdul Rahman',
    'Mohammed Ahmed',
    'Mr. & Mrs. Abdul Rahman'
  ];

  for (const name of testNames) {
    console.log(`\n========================================`);
    console.log(`TESTING: "${name}"`);
    console.log(`========================================`);

    // Set guest input
    await evaluate(`
      (() => {
        const input = document.querySelector('input[placeholder*="Abdul Rahman"]') || document.querySelector('input[type="text"]');
        if (input) {
          const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
          setter.call(input, ${JSON.stringify(name)});
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      })()
    `);

    await new Promise(r => setTimeout(r, 400));

    const safeName = name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();

    // 1. Capture DOM preview screenshots
    await captureElementScreenshot('#invitation-card-1-container', `preview-c1-${safeName}.png`);
    await captureElementScreenshot('#invitation-card-2-container', `preview-c2-${safeName}.png`);
    await captureElementScreenshot('#invitation-card-3-container', `preview-c3-${safeName}.png`);

    // 2. Export Canvas PNGs for each card and save them
    for (let cardId of [1, 2, 3]) {
      const dataUrl = await evaluate(`
        (async () => {
          try {
            // Import individualCardExport or use the global function if exposed, or test canvas directly
            const cfg = {
              1: { topPercent: 31.54, leftPercent: 42.50, color: '#F5DEB3', rot: 0, fontSize: 16 },
              2: { topPercent: 38.20, leftPercent: 50.0, color: '#4A361C', rot: 0, fontSize: 22, labelColor: '#91773E' },
              3: { topPercent: 30.46, leftPercent: 32.22, color: '#2B2018', rot: -2.5, fontSize: 15.5 }
            }[${cardId}];

            const c = document.createElement('canvas');
            const ctx = c.getContext('2d');
            const img = new Image();
            await new Promise(r => {
              img.onload = r;
              img.src = '/invitations/card-' + ${cardId} + '.jpg';
            });
            c.width = ${cardId === 2 ? 920 : 1024};
            c.height = ${cardId === 2 ? 1220 : 558};
            ctx.drawImage(img, 0, 0, c.width, c.height);

            const tx = (cfg.leftPercent / 100) * c.width;
            const ty = (cfg.topPercent / 100) * c.height;

            ctx.save();
            ctx.translate(tx, ty);
            if (cfg.rot) ctx.rotate((cfg.rot * Math.PI) / 180);

            if (${cardId} === 1) {
              ctx.shadowColor = 'rgba(0,0,0,0.55)';
              ctx.shadowBlur = 2;
              ctx.shadowOffsetY = 1;
              ctx.font = '600 ' + cfg.fontSize + 'px "Cormorant Garamond", Georgia, serif';
              ctx.fillStyle = cfg.color;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(${JSON.stringify(name)}, 0, 0);
            } else if (${cardId} === 2) {
              const label = 'Guest Name: ';
              ctx.font = 'italic 500 ' + cfg.fontSize + 'px "Cormorant Garamond", Georgia, serif';
              const lw = ctx.measureText(label).width;
              ctx.font = '600 ' + cfg.fontSize + 'px "Cormorant Garamond", Georgia, serif';
              const nw = ctx.measureText(${JSON.stringify(name)}).width;
              const sx = -(lw + nw) / 2;
              ctx.font = 'italic 500 ' + cfg.fontSize + 'px "Cormorant Garamond", Georgia, serif';
              ctx.fillStyle = cfg.labelColor;
              ctx.textAlign = 'left';
              ctx.textBaseline = 'middle';
              ctx.fillText(label, sx, 0);
              ctx.font = '600 ' + cfg.fontSize + 'px "Cormorant Garamond", Georgia, serif';
              ctx.fillStyle = cfg.color;
              ctx.fillText(${JSON.stringify(name)}, sx + lw, 0);
            } else {
              ctx.font = '600 ' + cfg.fontSize + 'px "Cormorant Garamond", Georgia, serif';
              ctx.fillStyle = cfg.color;
              ctx.textAlign = 'left';
              ctx.textBaseline = 'alphabetic';
              ctx.fillText(${JSON.stringify(name)}, 0, 0);
            }
            ctx.restore();

            return c.toDataURL('image/png');
          } catch (e) {
            return null;
          }
        })()
      `);

      if (dataUrl) {
        const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
        fs.writeFileSync(`export-c${cardId}-${safeName}.png`, Buffer.from(base64, 'base64'));
        console.log(`Saved export image: export-c${cardId}-${safeName}.png`);
      }
    }
  }

  // Test button states on Card 1
  console.log('\n--- Testing Independent Copy Button for Card 1 ---');
  await evaluate(`
    (() => {
      const btn = document.getElementById('copy-card-1-btn');
      if (btn) btn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 400));
  const buttons1 = await evaluate(`
    (() => {
      return {
        card1Btn: document.getElementById('copy-card-1-btn')?.innerText.trim(),
        card2Btn: document.getElementById('copy-card-2-btn')?.innerText.trim(),
        card3Btn: document.getElementById('copy-card-3-btn')?.innerText.trim()
      };
    })()
  `);
  console.log('Button labels after Card 1 click:', buttons1);

  ws.close();
  console.log('\nAll tests complete!');
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
