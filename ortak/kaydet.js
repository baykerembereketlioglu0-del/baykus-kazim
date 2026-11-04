// Bölümü MP4 olarak kaydeder (1080x1920, 30 fps, H.264 + AAC).
// Kullanım:  node ortak/kaydet.js <bölüm-klasörü> [--fps 30] [--crf 18] [--workers 4] [--out dosya.mp4] [--from sn --to sn]
// Gereken: Node 18+, ffmpeg, playwright (npm i playwright && npx playwright install chromium)
// Bölüm klasöründe ses.mp3 varsa (ortak/seslendir.js üretir) seslendirme de karışıma eklenir.
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const path = require('path'), fs = require('fs'), os = require('os');
const { music, rain, writeWav } = require('./muzik.js');

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const EP_DIR = path.resolve(args[0] || '.'), FPS = +opt('fps', 30), CRF = opt('crf', '18');
const WORKERS = +opt('workers', Math.max(1, Math.min(4, os.cpus().length)));
const BUILD = path.join(EP_DIR, 'build'); fs.mkdirSync(BUILD, { recursive: true });
const OUT = path.resolve(opt('out', path.join(EP_DIR, path.basename(EP_DIR) + '.mp4')));
const url = 'file://' + path.join(EP_DIR, 'index.html') + '?capture=1';

function run(cmd, a) { return new Promise((res, rej) => { const p = spawn(cmd, a, { stdio: ['ignore', 'inherit', 'inherit'] }); p.on('close', c => c ? rej(new Error(cmd + ' ' + c)) : res()); }); }

async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: 540, height: 960 } });
  page.on('pageerror', e => console.error('Sayfa hatası:', e.message));
  await page.goto(url); await page.waitForFunction(() => window.READY === true, null, { timeout: 60000 });
  return page;
}

async function renderSegment(browser, idx, f0, f1, dur) {
  const page = await openPage(browser), file = path.join(BUILD, `seg${idx}.mp4`);
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', CRF, '-tune', 'animation', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
    '-g', String(FPS * 2), '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', file], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((r, j) => ff.on('close', c => c ? j(new Error('ffmpeg ' + c)) : r()));
  for (let f = f0; f < f1; f++) {
    const data = await page.evaluate(t => { window.seekTo(t); return document.getElementById('c').toDataURL('image/png'); }, Math.min(f / FPS, dur));
    if (!ff.stdin.write(Buffer.from(data.slice(data.indexOf(',') + 1), 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
    progress[idx] = f - f0 + 1;
  }
  ff.stdin.end(); await done; await page.close(); return file;
}
const progress = [];

(async () => {
  const t0 = Date.now();
  const browser = await chromium.launch({ headless: true });
  const probe = await openPage(browser);
  const DUR = await probe.evaluate(() => window.DURATION); await probe.close();
  const from = +opt('from', 0), to = Math.min(+opt('to', DUR), DUR);
  const F0 = Math.round(from * FPS), F1 = Math.ceil(to * FPS), total = F1 - F0, per = Math.ceil(total / WORKERS);
  console.log(`Süre ${(to - from).toFixed(1)} sn, ${total} kare, ${WORKERS} işçi`);

  // 1) ses: müzik + yağmur (+ varsa seslendirme)
  const mW = path.join(BUILD, 'muzik.wav'), rW = path.join(BUILD, 'yagmur.wav'), aOut = path.join(BUILD, 'ses.m4a');
  writeWav(mW, ...music(DUR)); writeWav(rW, ...rain(DUR));
  const voice = path.join(EP_DIR, 'ses.mp3'), hasVoice = fs.existsSync(voice);
  const fc = '[0:a]aecho=0.8:0.6:90|170:0.3|0.2,volume=' + (hasVoice ? '0.30' : '0.62') + '[m];[1:a]volume=' + (hasVoice ? '0.22' : '0.34') + '[r];' +
    (hasVoice ? '[2:a]volume=1.0[v];[m][r][v]amix=inputs=3:normalize=0' : '[m][r]amix=inputs=2:normalize=0') +
    `,atrim=${from}:${to},asetpts=PTS-STARTPTS,loudnorm=I=-14:TP=-1.5:LRA=11[a]`;
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', mW, '-i', rW, ...(hasVoice ? ['-i', voice] : []), '-filter_complex', fc, '-map', '[a]', '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', aOut]);
  console.log(hasVoice ? 'Ses: müzik + yağmur + seslendirme' : 'Ses: müzik + yağmur (seslendirme yok)');

  // 2) görüntü: paralel parçalar
  const timer = setInterval(() => { const d = progress.reduce((a, b) => a + (b || 0), 0); process.stdout.write(`\rKare ${d}/${total}  (${((Date.now() - t0) / 1000).toFixed(0)} sn)`); }, 2000);
  const segs = await Promise.all(Array.from({ length: WORKERS }, (_, i) => {
    const a = F0 + i * per, b = Math.min(F1, a + per); return a < b ? renderSegment(browser, i, a, b, DUR) : null;
  }).filter(Boolean));
  clearInterval(timer); await browser.close();

  // 3) birleştir
  const list = path.join(BUILD, 'list.txt'); fs.writeFileSync(list, segs.map(s => `file '${s.replace(/'/g, "'\\''")}'`).join('\n'));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  await run('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-i', aOut, '-map', '0:v', '-map', '1:a', '-c', 'copy', '-shortest', '-movflags', '+faststart', OUT]);
  const mb = (fs.statSync(OUT).size / 1048576).toFixed(1);
  console.log(`\nHazır: ${OUT} (${mb} MB, ${((Date.now() - t0) / 1000).toFixed(0)} sn)`);
})().catch(e => { console.error(e); process.exit(1); });
