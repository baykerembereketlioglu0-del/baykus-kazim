// İllüstrasyondan (ör. Gemini ile üretilmiş görsel) Baykuş Kazım kapağı yapar: 1080x1920, üstte altın "BAYKUŞ KAZIM",
// altta kalın yoğun yazı tipiyle kanca cümlesi (beyaz + altın satır).
// Kullanım: node ortak/kapak-yap.js <görsel> <çıktı.jpg> "1. SATIR (beyaz)" "2. SATIR (altın)" [--odak 0.5]
//   --odak: görsel 9:16'ya kırpılırken yatay odak (0 sol, 1 sağ). --y: ilk satırın taban çizgisi (px, varsayılan 1620). Satırları boş bırakmak için "" ver.
const { chromium } = require('playwright'), path = require('path'), fs = require('fs');
const a = process.argv.slice(2), opt = (k, d) => { const i = a.indexOf('--' + k); if (i < 0) return d; const v = a[i + 1]; a.splice(i, 2); return v; };
const focus = +opt('odak', .5), ybase = +opt('y', 1620), [img, out, l1 = '', l2 = ''] = a;
const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Oswald:wght@600;700&display=block" rel="stylesheet"></head>
<body style="margin:0;background:#000"><canvas id="c" width="1080" height="1920"></canvas><img id="i" src="data:${/\.png$/i.test(img) ? 'image/png' : 'image/jpeg'};base64,${fs.readFileSync(path.resolve(img)).toString('base64')}" style="display:none">
<script>
const L1 = ${JSON.stringify(l1.toLocaleUpperCase('tr'))}, L2 = ${JSON.stringify(l2.toLocaleUpperCase('tr'))}, F = ${focus}, YB = ${ybase};
async function go() {
  await document.fonts.load('700 100px Oswald'); await document.fonts.load('700 60px Cinzel');
  const im = document.getElementById('i'); await im.decode();
  const x = document.getElementById('c').getContext('2d'), W = 1080, H = 1920;
  const s = Math.max(W / im.naturalWidth, H / im.naturalHeight), w = im.naturalWidth * s, h = im.naturalHeight * s;
  x.drawImage(im, (W - w) * F, (H - h) / 2, w, h);
  let g = x.createLinearGradient(0, 0, 0, 340); g.addColorStop(0, 'rgba(8,4,2,.78)'); g.addColorStop(1, 'rgba(8,4,2,0)'); x.fillStyle = g; x.fillRect(0, 0, W, 340);
  g = x.createLinearGradient(0, H * .62, 0, H); g.addColorStop(0, 'rgba(8,4,2,0)'); g.addColorStop(.55, 'rgba(8,4,2,.55)'); g.addColorStop(1, 'rgba(8,4,2,.85)'); x.fillStyle = g; x.fillRect(0, H * .62, W, H * .38);
  // üst başlık: altın, harf aralıklı serif
  x.save(); x.font = '700 76px Cinzel, Georgia, serif'; x.textAlign = 'center'; x.letterSpacing = '22px';
  g = x.createLinearGradient(0, 40, 0, 130); g.addColorStop(0, '#fbe7b0'); g.addColorStop(.5, '#e2b665'); g.addColorStop(1, '#b8863c');
  x.shadowColor = 'rgba(0,0,0,.85)'; x.shadowBlur = 18; x.shadowOffsetY = 4; x.fillStyle = g; x.fillText('BAYKUŞ KAZIM', W / 2 + 11, 118); x.restore();
  // kanca: yoğun kalın yazı, gölgeli
  const line = (t, y, col, max) => { if (!t) return; let fs = 150; x.font = '700 ' + fs + 'px Oswald, Impact, sans-serif'; while (x.measureText(t).width > max && fs > 60) { fs -= 4; x.font = '700 ' + fs + 'px Oswald, Impact, sans-serif'; }
    x.save(); x.textAlign = 'center'; x.textBaseline = 'alphabetic'; x.lineJoin = 'round';
    x.shadowColor = 'rgba(0,0,0,.9)'; x.shadowBlur = 26; x.shadowOffsetY = 8; x.lineWidth = 10; x.strokeStyle = 'rgba(0,0,0,.85)'; x.strokeText(t, W / 2, y);
    x.shadowColor = 'transparent'; x.fillStyle = col; x.fillText(t, W / 2, y); x.restore(); return fs; };
  const f1 = line(L1, YB, '#ffffff', 960); line(L2, YB + (f1 || 130) * 1.08, (()=>{ const gg = x.createLinearGradient(0, 1640, 0, 1790); gg.addColorStop(0, '#f2c766'); gg.addColorStop(1, '#c8902f'); return gg; })(), 960);
  window.READY = true;
}
go();
</script></body></html>`;
(async () => {
  const tmp = path.join(path.dirname(path.resolve(out)), '.kapak-tmp.html'); fs.writeFileSync(tmp, html);
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 540, height: 960 } });
  p.on('pageerror', e => console.error('Sayfa hatası:', e.message));
  await p.goto('file://' + tmp); await p.waitForFunction(() => window.READY === true, null, { timeout: 60000 });
  const d = await p.evaluate(() => document.getElementById('c').toDataURL('image/png')); await b.close(); fs.unlinkSync(tmp);
  const png = path.resolve(out).replace(/\.jpe?g$/i, '') + '.tmp.png'; fs.writeFileSync(png, Buffer.from(d.split(',')[1], 'base64'));
  require('child_process').execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', png, '-q:v', '2', path.resolve(out)]); fs.unlinkSync(png);
  console.log('Hazır:', path.resolve(out));
})();
