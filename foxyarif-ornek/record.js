// Kullanım: npm i playwright && npx playwright install chromium && node record.js
// Gereken: ffmpeg (PATH'te)
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');

const FPS = 30, DURATION = 20, TOTAL = FPS * DURATION;

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 540, height: 960 } });
  await page.goto('file://' + path.resolve(__dirname, 'index.html') + '?capture=1');
  await page.waitForFunction(() => typeof window.seekTo === 'function');

  // Kareleri diske yazmadan doğrudan ffmpeg'e akıt (1080x1920 canvas)
  const ff = spawn('ffmpeg', [
    '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '16',
    path.resolve(__dirname, 'foxyarif.mp4'),
  ], { stdio: ['pipe', 'inherit', 'inherit'] });

  for (let f = 0; f < TOTAL; f++) {
    const dataUrl = await page.evaluate((t) => {
      window.seekTo(t);
      return document.getElementById('c').toDataURL('image/png');
    }, f / FPS);
    const buf = Buffer.from(dataUrl.split(',')[1], 'base64');
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if (f % 30 === 0) console.log(`Kare ${f}/${TOTAL}`);
  }

  ff.stdin.end();
  await new Promise((r) => ff.on('close', r));
  await browser.close();
  console.log('Hazır: foxyarif.mp4');
})();
