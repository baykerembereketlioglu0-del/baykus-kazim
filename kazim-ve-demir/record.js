// Kullanım: npm i playwright && npx playwright install chromium && node record.js
// Gereken: ffmpeg. audio.mp3 varsa (generate_voices.js) videoya otomatik eklenir.
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path'), fs = require('fs');
const FPS = 30, audio = path.join(__dirname, 'audio.mp3');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 540, height: 960 } });
  await page.goto('file://' + path.resolve(__dirname, 'index.html') + '?capture=1');
  await page.waitForFunction(() => typeof window.seekTo === 'function');
  const total = Math.ceil((await page.evaluate(() => window.DURATION)) * FPS);
  const hasAudio = fs.existsSync(audio);

  const ff = spawn('ffmpeg', [
    '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    ...(hasAudio ? ['-i', audio] : []),
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '16',
    ...(hasAudio ? ['-c:a', 'aac', '-b:a', '192k'] : []),
    path.resolve(__dirname, 'surüden_korkma.mp4'),
  ], { stdio: ['pipe', 'inherit', 'inherit'] });

  for (let f = 0; f < total; f++) {
    const url = await page.evaluate((t) => { window.seekTo(t); return document.getElementById('c').toDataURL('image/png'); }, f / FPS);
    const buf = Buffer.from(url.split(',')[1], 'base64');
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if (f % 30 === 0) console.log(`Kare ${f}/${total}`);
  }
  ff.stdin.end(); await new Promise((r) => ff.on('close', r)); await browser.close();
  console.log(hasAudio ? 'Hazır (sesli): surüden_korkma.mp4' : 'Hazır (sessiz, audio.mp3 yok): surüden_korkma.mp4');
})();
